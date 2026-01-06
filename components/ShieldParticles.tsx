'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import { loadPolygonMaskPlugin } from "@tsparticles/plugin-polygon-mask";

export default function ShieldParticles() {
    const [init, setInit] = useState(false);

    // Initialize tsparticles engine
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadPolygonMaskPlugin(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const [repulseEnabled, setRepulseEnabled] = useState(false);

    const options: ISourceOptions = {
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: repulseEnabled ? ["grab", "repulse"] : "grab",
                },
                onClick: {
                    enable: true,
                    mode: "push",
                },
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.5,
                    },
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
                push: {
                    quantity: 4,
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
                opacity: 0.3,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 1, // Slower movement
                straight: false,
            },
            number: {
                density: {
                    enable: false, // Disable density to have fixed number of particles for the mask
                },
                value: 200, // Higher density for shape definition
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
        background: {
            color: "transparent"
        },
        polygon: {
            draw: {
                enable: false, // Don't draw the path lines
            },
            enable: true,
            inline: {
                arrangement: "equidistant",
            },
            move: {
                radius: 10,
                type: "path",
            },
            position: {
                x: 50,
                y: 50,
            },
            scale: 1, // Adjust based on container size vs image size
            type: "inline",
            url: "/shield-mask.png",
        }
    };

    if (init) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                {/* VAISI Text Overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
                    <h2 className="font-serif text-8xl md:text-9xl text-primary font-bold tracking-widest opacity-10">
                        VAISI
                    </h2>
                </div>

                <Particles
                    id="shield-particles"
                    options={options}
                    className="w-full h-full absolute inset-0 z-10"
                />

                {/* Toggle Button */}
                <button
                    onClick={() => setRepulseEnabled(!repulseEnabled)}
                    className="absolute bottom-4 right-4 z-20 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-bold text-primary shadow-sm hover:bg-white transition-all"
                >
                    {repulseEnabled ? "Disable Repulsion" : "Enable Repulsion"}
                </button>
            </div>
        );
    }

    return <></>;
}
