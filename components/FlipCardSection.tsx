'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { StaggerGroup, StaggerItem, hoverLift } from '@/components/motion';

const cards = [
  {
    number: '01',
    title: 'An Under-Discussed Challenge',
    imageSrc: '/underdiscussed_challenge.png',
    imageAlt: 'An Under-Discussed Challenge',
    bullets: [
      <>Managing risks from advanced AI is one of the{' '}
        <a href="https://arxiv.org/pdf/2310.17688" target="_blank" rel="noopener noreferrer" className="text-secondary underline decoration-transparent hover:decoration-secondary transition-colors duration-200 bullet-link">most important issues</a>
        {' '}of our time. Advanced AI could{' '}
        <a href="https://ai-2027.com/" target="_blank" rel="noopener noreferrer" className="text-secondary underline decoration-transparent hover:decoration-secondary transition-colors duration-200 bullet-link">arrive sooner than expected</a>
        {' '}— bringing transformative benefits but also existential risks if developed without adequate safeguards and governance.</>,
      "The field needs more researchers, policymakers, and bridge-builders to help ensure AI goes well for humanity during this critical window.",
    ],
  },
  {
    number: '02',
    title: 'Our Approach',
    imageSrc: '/our_approach.png',
    imageAlt: 'Our Approach',
    bullets: [
      "We equip the UVA community with the knowledge and skills to contribute to AI governance and risk reduction — through structured learning programs, research opportunities, and clear pathways connecting members with mentors and careers in technical alignment and AI policy.",
      "In short, we're UVA's home for talented, motivated individuals committed to ensuring advanced AI benefits humanity.",
    ],
  },
];

function FlipCard({ card }: { card: typeof cards[0] }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={() => setFlipped((f) => !f)}
      {...hoverLift}
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          aspectRatio: '2 / 3',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-primary bg-white overflow-hidden flex flex-col"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Title area */}
          <div className="p-6 flex-shrink-0">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-3">{card.title}</h2>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 select-none">
              <RotateCcw size={10} />
              Flip to learn more
            </p>
          </div>
          {/* Image area */}
          <div className="flex-1 relative">
            <Image src={card.imageSrc} alt={card.imageAlt} fill className="object-cover" />
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-primary bg-white overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="p-6 flex flex-col justify-center min-h-full">
            <ul className="space-y-5">
              {card.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-4 text-gray-500 leading-relaxed">
                  <Image src="/vaisi_flower.png" alt="" width={16} height={16} className="flex-shrink-0 mt-1 object-contain" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="absolute bottom-4 left-6 flex items-center gap-1.5 text-xs text-gray-400 select-none">
            <RotateCcw size={10} />
            Flip back
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FlipCardSection() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-0">
      <div className="md:w-96 flex-shrink-0 md:pr-16">
        <h2 className="text-[45px] md:text-[75px] font-bold text-gray-900 leading-tight">The Case for AI Safety...</h2>
      </div>
      <div className="hidden md:block w-px self-stretch bg-gray-200 flex-shrink-0" />
      <StaggerGroup className="md:pl-16 w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6" stagger={0.15}>
        {cards.map((card) => (
          <StaggerItem key={card.number}>
            <FlipCard card={card} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
