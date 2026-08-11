/**
 * Answers the configurator mapping questions for a .glb:
 *   which meshes use which material, and where each material physically sits.
 *
 * World-space extents are computed by transforming each primitive's POSITION
 * accessor min/max through its node's TRS, so "is this a floor or a wall?" is
 * answered from the file rather than guessed.
 *
 * Usage: node scripts/inspect-glb-materials.mjs [path-to.glb]
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const file = process.argv[2] ?? join(ROOT, 'public', 'models', 'vacuum-elevator-pve37.glb');
const buf = readFileSync(file);

let offset = 12;
let json = null;
while (offset < buf.length) {
  const len = buf.readUInt32LE(offset);
  const type = buf.readUInt32LE(offset + 4);
  if (type === 0x4e4f534a) json = JSON.parse(buf.subarray(offset + 8, offset + 8 + len).toString('utf8'));
  offset += 8 + len + (len % 4 ? 4 - (len % 4) : 0);
}
const g = json;
const list = (a) => a ?? [];
const mname = (i) => (i === undefined ? '(none)' : (g.materials?.[i]?.name ?? `<material ${i}>`));

/* --------------------------------------------------------------- math ------ */
function trs(node) {
  const [tx, ty, tz] = node.translation ?? [0, 0, 0];
  const [qx, qy, qz, qw] = node.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = node.scale ?? [1, 1, 1];
  // Rotation matrix from quaternion
  const x2 = qx + qx, y2 = qy + qy, z2 = qz + qz;
  const xx = qx * x2, xy = qx * y2, xz = qx * z2;
  const yy = qy * y2, yz = qy * z2, zz = qz * z2;
  const wx = qw * x2, wy = qw * y2, wz = qw * z2;
  return [
    [(1 - (yy + zz)) * sx, (xy - wz) * sy, (xz + wy) * sz, tx],
    [(xy + wz) * sx, (1 - (xx + zz)) * sy, (yz - wx) * sz, ty],
    [(xz - wy) * sx, (yz + wx) * sy, (1 - (xx + yy)) * sz, tz],
  ];
}
const apply = (m, [x, y, z]) => [
  m[0][0] * x + m[0][1] * y + m[0][2] * z + m[0][3],
  m[1][0] * x + m[1][1] * y + m[1][2] * z + m[1][3],
  m[2][0] * x + m[2][1] * y + m[2][2] * z + m[2][3],
];

const corners = (min, max) => {
  const out = [];
  for (const x of [min[0], max[0]]) for (const y of [min[1], max[1]]) for (const z of [min[2], max[2]]) out.push([x, y, z]);
  return out;
};
const growBox = (box, p) => {
  for (let i = 0; i < 3; i++) {
    box.min[i] = Math.min(box.min[i], p[i]);
    box.max[i] = Math.max(box.max[i], p[i]);
  }
};
const newBox = () => ({ min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] });
const fmt = (b) =>
  `x[${b.min[0].toFixed(2)}, ${b.max[0].toFixed(2)}]  y[${b.min[1].toFixed(2)}, ${b.max[1].toFixed(2)}]  z[${b.min[2].toFixed(2)}, ${b.max[2].toFixed(2)}]`;
const size = (b) => [b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]];

/* ---------------------------------------------- gather per material/mesh --- */
const perMaterial = new Map();
const meshUsers = new Map(); // meshIndex -> node names
const sceneBox = newBox();

list(g.nodes).forEach((node, ni) => {
  if (node.mesh === undefined) return;
  const m = trs(node);
  const mesh = g.meshes[node.mesh];
  if (!meshUsers.has(node.mesh)) meshUsers.set(node.mesh, []);
  meshUsers.get(node.mesh).push(node.name ?? `<node ${ni}>`);

  list(mesh.primitives).forEach((prim) => {
    const acc = g.accessors?.[prim.attributes?.POSITION];
    if (!acc?.min || !acc?.max) return;
    const key = mname(prim.material);
    if (!perMaterial.has(key)) {
      perMaterial.set(key, { box: newBox(), verts: 0, prims: 0, meshes: new Set(), nodes: new Set() });
    }
    const rec = perMaterial.get(key);
    rec.prims += 1;
    rec.verts += acc.count ?? 0;
    rec.meshes.add(mesh.name ?? `<mesh ${node.mesh}>`);
    rec.nodes.add(node.name ?? `<node ${ni}>`);
    for (const c of corners(acc.min, acc.max)) {
      const w = apply(m, c);
      growBox(rec.box, w);
      growBox(sceneBox, w);
    }
  });
});

console.log('='.repeat(78));
console.log('MATERIAL → GEOMETRY MAP');
console.log('='.repeat(78));
console.log(`model world bounds : ${fmt(sceneBox)}`);
console.log(`model size (x,y,z) : ${size(sceneBox).map((v) => v.toFixed(2)).join(' x ')}`);
console.log(`animations         : ${list(g.animations).length === 0 ? 'NONE' : list(g.animations).length}`);
console.log(`skins / cameras    : ${list(g.skins).length} / ${list(g.cameras).length}`);
console.log(`textures / images  : ${list(g.textures).length} / ${list(g.images).length}`);

for (const [name, rec] of [...perMaterial.entries()].sort((a, b) => b[1].verts - a[1].verts)) {
  const s = size(rec.box);
  const flat = s[1] < 0.25;
  const tall = s[1] > 1.5;
  console.log(`\n── "${name}"`);
  console.log(`   primitives : ${rec.prims}   vertices: ${rec.verts}   node instances: ${rec.nodes.size}`);
  console.log(`   world bbox : ${fmt(rec.box)}`);
  console.log(`   size       : ${s.map((v) => v.toFixed(2)).join(' x ')}  ${flat ? '→ FLAT (disc/plate)' : tall ? '→ TALL (spans height)' : ''}`);
  console.log(`   meshes     : ${[...rec.meshes].join(', ')}`);
}

console.log('\n' + '='.repeat(78));
console.log('MESH → MATERIALS (and how many nodes instance it)');
console.log('='.repeat(78));
list(g.meshes).forEach((mesh, mi) => {
  const mats = list(mesh.primitives).map((p) => `"${mname(p.material)}"`);
  const users = meshUsers.get(mi) ?? [];
  console.log(`\n[${mi}] ${mesh.name}  — instanced by ${users.length} node(s)`);
  console.log(`     materials: ${mats.join(' + ')}`);
  list(mesh.primitives).forEach((p, pi) => {
    const acc = g.accessors?.[p.attributes?.POSITION];
    const s = acc?.min && acc?.max ? acc.max.map((v, i) => (v - acc.min[i]).toFixed(2)).join(' x ') : '?';
    console.log(`       prim ${pi}: "${mname(p.material)}"  verts=${acc?.count ?? '?'}  localSize=${s}`);
  });
  if (users.length > 1) console.log(`     nodes: ${users.join(', ')}`);
});

/* ------------------------------------------------------- door separation --- */
console.log('\n' + '='.repeat(78));
console.log('DOOR GEOMETRY');
console.log('='.repeat(78));
const doorNodes = list(g.nodes)
  .map((n, i) => ({ n, i }))
  .filter(({ n }) => /door/i.test(n.name ?? ''));
console.log(`nodes with "door" in the name: ${doorNodes.length}`);
for (const { n, i } of doorNodes) {
  console.log(
    `  [${i}] ${n.name}  mesh=${n.mesh !== undefined ? `"${g.meshes[n.mesh].name}"` : '-'}  t=[${(n.translation ?? [0, 0, 0]).map((v) => v.toFixed(3))}]  r=[${(n.rotation ?? [0, 0, 0, 1]).map((v) => v.toFixed(3))}]`,
  );
}
console.log('\n' + '='.repeat(78));
