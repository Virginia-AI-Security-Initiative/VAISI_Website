"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

// The site's constellation effect (components/ParticlesBackground.tsx), recolored for a navy hero.
const options: ISourceOptions = {
  fpsLimit: 60,
  detectRetina: true,
  fullScreen: { enable: false },
  background: { color: "transparent" },
  interactivity: {
    events: { onHover: { enable: true, mode: "grab" } },
    modes: { grab: { distance: 160, links: { opacity: 0.55, color: "#dc6c3a" } } },
  },
  particles: {
    color: { value: ["#ffffff", "#ffffff", "#ffffff", "#dc6c3a"] },
    links: { enable: true, color: "#ffffff", distance: 150, opacity: 0.22, width: 1 },
    move: { enable: true, speed: 0.6, direction: "none", outModes: { default: "out" } },
    number: { value: 90, density: { enable: true } },
    opacity: { value: { min: 0.35, max: 0.85 } },
    size: { value: { min: 1, max: 2.5 } },
    shape: { type: "circle" },
  },
};

export default function HeroNetwork() {
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    initParticlesEngine(loadSlim).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="hackathon-hero-network"
      options={reducedMotion ? { ...options, particles: { ...options.particles, move: { enable: false } } } : options}
      className="absolute inset-0"
    />
  );
}
