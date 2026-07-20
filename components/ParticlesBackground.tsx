'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);

    // Initialize tsparticles engine ... test
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (): Promise<void> => {};

    // Configuration for the "network/constellation" effect
    const options: ISourceOptions = {
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "grab",
                },
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.5,
                    },
                },
            },
        },
        particles: {
            color: {
                value: "#232D4B", // UVA Blue
            },
            links: {
                color: "#232D4B",
                distance: 150,
                enable: true,
                opacity: 0.2, // Subtle
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 1.5, // Slow, calm movement
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                },
                value: 80, // Adjust density
            },
            opacity: {
                value: 0.3, // Subtle opacity
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
        fullScreen: {
            enable: false,
        },
        background: {
            color: "transparent", // Let the page background show through
        },
    };

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
                className="absolute inset-0" // Removed -z-10, content is z-10 so this will sit behind it
            />
        );
    }

    return <></>;
}
