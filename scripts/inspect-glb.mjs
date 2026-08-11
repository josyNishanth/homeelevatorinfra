/**
 * Prints the structure of a .glb file: nodes, meshes, materials, animations and
 * the node hierarchy.
 *
 * Reads the glTF JSON chunk out of the GLB container directly, so it needs no
 * three.js and no DOM — it runs anywhere Node runs.
 *
 * Usage: node scripts/inspect-glb.mjs [path-to.glb]
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const file = process.argv[2] ?? join(ROOT, 'public', 'models', 'vacuum-elevator-pve37.glb');

const buf = readFileSync(file);

/* ------------------------------------------------- GLB container parsing ---- */
const magic = buf.readUInt32LE(0);
if (magic !== 0x46546c67) throw new Error(`Not a GLB file (magic=0x${magic.toString(16)})`);

const version = buf.readUInt32LE(4);
const totalLength = buf.readUInt32LE(8);

let offset = 12;
let json = null;
let binLength = 0;

while (offset < buf.length) {
  const chunkLength = buf.readUInt32LE(offset);
  const chunkType = buf.readUInt32LE(offset + 4);
  const chunkStart = offset + 8;

  if (chunkType === 0x4e4f534a) {
    json = JSON.parse(buf.subarray(chunkStart, chunkStart + chunkLength).toString('utf8'));
  } else if (chunkType === 0x004e4942) {
    binLength = chunkLength;
  }
  offset = chunkStart + chunkLength + (chunkLength % 4 === 0 ? 0 : 4 - (chunkLength % 4));
}

if (!json) throw new Error('No JSON chunk found in GLB');

const g = json;
const list = (a) => a ?? [];
const name = (o, i, prefix) => o?.name ?? `<unnamed ${prefix} ${i}>`;

/* --------------------------------------------------------------- summary ---- */
console.log('='.repeat(74));
console.log('GLB INSPECTION');
console.log('='.repeat(74));
console.log(`file            ${file}`);
console.log(`size            ${(buf.length / 1024).toFixed(1)} KB`);
console.log(`glb version     ${version}`);
console.log(`declared bytes  ${totalLength}`);
console.log(`binary chunk    ${(binLength / 1024).toFixed(1)} KB`);
console.log(`generator       ${g.asset?.generator ?? '(none)'}`);
console.log(`glTF version    ${g.asset?.version ?? '(none)'}`);
console.log(`extensions used ${list(g.extensionsUsed).join(', ') || '(none)'}`);
console.log(`extensions req. ${list(g.extensionsRequired).join(', ') || '(none)'}`);

console.log('\nCOUNTS');
const counts = {
  scenes: list(g.scenes).length,
  nodes: list(g.nodes).length,
  meshes: list(g.meshes).length,
  primitives: list(g.meshes).reduce((n, m) => n + list(m.primitives).length, 0),
  materials: list(g.materials).length,
  textures: list(g.textures).length,
  images: list(g.images).length,
  animations: list(g.animations).length,
  skins: list(g.skins).length,
  cameras: list(g.cameras).length,
};
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(12)} ${v}`);

/* ----------------------------------------------------------------- nodes ---- */
console.log('\nNODES');
list(g.nodes).forEach((n, i) => {
  const bits = [];
  if (n.mesh !== undefined) bits.push(`mesh=${n.mesh} (${name(g.meshes?.[n.mesh], n.mesh, 'mesh')})`);
  if (n.camera !== undefined) bits.push(`camera=${n.camera}`);
  if (n.skin !== undefined) bits.push(`skin=${n.skin}`);
  if (n.translation) bits.push(`t=[${n.translation.map((v) => +v.toFixed(3))}]`);
  if (n.rotation) bits.push(`r=[${n.rotation.map((v) => +v.toFixed(3))}]`);
  if (n.scale) bits.push(`s=[${n.scale.map((v) => +v.toFixed(3))}]`);
  if (n.children) bits.push(`children=[${n.children}]`);
  console.log(`  [${i}] ${name(n, i, 'node')}${bits.length ? ` — ${bits.join(' ')}` : ''}`);
});

/* ---------------------------------------------------------------- meshes ---- */
console.log('\nMESHES  (primitive → material)');
list(g.meshes).forEach((m, i) => {
  console.log(`  [${i}] ${name(m, i, 'mesh')}  (${list(m.primitives).length} primitive(s))`);
  list(m.primitives).forEach((p, pi) => {
    const mat = p.material !== undefined ? name(g.materials?.[p.material], p.material, 'material') : '(none)';
    const attrs = Object.keys(p.attributes ?? {}).join(', ');
    const vertCount = p.attributes?.POSITION !== undefined ? g.accessors?.[p.attributes.POSITION]?.count : '?';
    console.log(`        prim ${pi}: material=${p.material ?? '-'} "${mat}"  verts=${vertCount}  attrs=[${attrs}]`);
  });
});

/* ------------------------------------------------------------- materials ---- */
console.log('\nMATERIALS');
list(g.materials).forEach((m, i) => {
  const pbr = m.pbrMetallicRoughness ?? {};
  const bits = [];
  if (pbr.baseColorFactor) bits.push(`baseColor=[${pbr.baseColorFactor.map((v) => +v.toFixed(3))}]`);
  if (pbr.metallicFactor !== undefined) bits.push(`metallic=${pbr.metallicFactor}`);
  if (pbr.roughnessFactor !== undefined) bits.push(`roughness=${pbr.roughnessFactor}`);
  if (pbr.baseColorTexture) bits.push(`baseColorTex=${pbr.baseColorTexture.index}`);
  if (m.alphaMode) bits.push(`alphaMode=${m.alphaMode}`);
  if (m.alphaCutoff !== undefined) bits.push(`alphaCutoff=${m.alphaCutoff}`);
  if (m.doubleSided !== undefined) bits.push(`doubleSided=${m.doubleSided}`);
  if (m.emissiveFactor?.some((v) => v > 0)) bits.push(`emissive=[${m.emissiveFactor}]`);
  if (m.extensions) bits.push(`ext=${Object.keys(m.extensions).join('+')}`);
  console.log(`  [${i}] ${name(m, i, 'material')}`);
  console.log(`        ${bits.join('  ')}`);
});

/* ------------------------------------------------------------ animations ---- */
console.log('\nANIMATIONS');
if (!list(g.animations).length) {
  console.log('  (none)');
} else {
  list(g.animations).forEach((a, i) => {
    console.log(`  [${i}] ${name(a, i, 'animation')} — ${list(a.channels).length} channel(s)`);
    list(a.channels).forEach((c) => {
      const targetNode = c.target?.node;
      console.log(
        `        ${c.target?.path} → node ${targetNode} (${name(g.nodes?.[targetNode], targetNode, 'node')})`,
      );
    });
  });
}

/* -------------------------------------------------------------- hierarchy --- */
console.log('\nHIERARCHY');
const walk = (idx, depth) => {
  const n = g.nodes?.[idx];
  if (!n) return;
  const meshLabel = n.mesh !== undefined ? `  ▸ mesh "${name(g.meshes?.[n.mesh], n.mesh, 'mesh')}"` : '';
  console.log(`${'  '.repeat(depth + 1)}${name(n, idx, 'node')}${meshLabel}`);
  list(n.children).forEach((c) => walk(c, depth + 1));
};
list(g.scenes).forEach((s, i) => {
  console.log(`  scene [${i}] ${name(s, i, 'scene')}`);
  list(s.nodes).forEach((n) => walk(n, 1));
});

console.log('\n' + '='.repeat(74));
