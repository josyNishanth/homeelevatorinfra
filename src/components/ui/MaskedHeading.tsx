import type { ElementType } from 'react';
import { gsap, prefersReducedMotion, useGsap } from '../../hooks/useScrollAnimation';

type Props = {
  /** Use \n to force a line break. */
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Animate on load instead of on scroll — used by the hero. */
  onLoad?: boolean;
  stagger?: number;
};

/**
 * Headline set in the display face, revealed word by word from behind a mask.
 * Words are real text nodes, so the heading stays selectable and readable to
 * assistive technology.
 */
export default function MaskedHeading({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  onLoad = false,
  stagger = 0.055,
}: Props) {
  const scope = useGsap<HTMLElement>(
    (el) => {
      const words = el.querySelectorAll<HTMLElement>('[data-word]');
      if (!words.length || prefersReducedMotion()) return;

      gsap.from(words, {
        yPercent: 118,
        duration: 1,
        delay,
        stagger,
        ease: 'power4.out',
        ...(onLoad ? {} : { scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
      });
    },
    [text, delay, onLoad, stagger],
  );

  return (
    <Tag ref={scope} className={`display-type ${className}`}>
      {text.split('\n').map((line, li) => {
        const words = line.split(' ');
        return (
          <span key={li} className="block">
            {words.map((word, wi) => (
              <span key={`${li}-${wi}`}>
                <span className="mask-word">
                  <span data-word className="inline-block">
                    {word}
                  </span>
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
