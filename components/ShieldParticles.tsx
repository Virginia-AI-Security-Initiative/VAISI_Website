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
        fpsLimit: 120, // Limits frame rate (e.g. 30, 60, 120) for performance
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    // Modes: "grab" (connect lines), "repulse" (push away), "bubble" (grow), "trail" (leave trail)
                    mode: repulseEnabled ? ["grab", "repulse"] : "grab", 
                },
                onClick: {
                    enable: true,
                    // Modes: "push" (add particles), "remove" (delete particles), "repulse", "bubble"
                    mode: "push",
                },
            },
            modes: {
                grab: {
                    distance: 100, // Distance for linking to mouse 
                    links: {
                        opacity: 0.1, 
                    },
                },
                repulse: {
                    distance: 50, // Radius of repulsion circle
                    duration: 0.4, // Time to return to normal
                },
                push: {
                    quantity: 2, // How many particles to add on click
                },
            },
        },
        particles: {
            color: {
                value: "#232D4B", // Hex code, "random", or array ["#ff0000", "#00ff00"]
            },
            links: {
                color: "#232D4B",
                distance: 100, // Max distance to link particles
                enable: true,
                opacity: 0.3, // 0 to 1
                width: 1, // Line thickness
            },
            move: {
                // Direction: "none", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left"
                direction: "none", 
                enable: true,
                outModes: {
                    default: "bounce", // "bounce" (reflect), "out" (leave screen), "destroy" (disappear)
                },
                random: false,
                speed: 1, // Lower = slower, Higher = faster
                straight: false,
            },
            number: {
                density: {
                    enable: false, // Must be false for fixed polygon shape
                },
                value: 100, // Total number of particles in the shape
            },
            opacity: {
                value: 0.5, // 0.0 (transparent) to 1.0 (opaque)
            },
            shape: {
                // Types: "circle", "square", "triangle", "polygon", "star", "image"
                type: "circle", 
            },
            size: {
                value: { min: 1, max: 3 }, // Fixed value (e.g. 3) or range { min, max }
            },
        },
        detectRetina: true,
        background: {
            color: "transparent"
        },
        polygon: {
            draw: {
                enable: false, // If true, draws the path outline
            },
            enable: true, // Must be true for mask to work
            inline: {
                // "equidistant": particles spaced evenly on path
                // "one-per-point": one particle per SVG path point
                // "random-point": particles on random points of path
                // "random-length": particles on random positions along path length
                arrangement: "equidistant",
            },
            move: {
                radius: 10, // Max distance particles wander from their spot
                // "path": particles follow the path
                // "radius": particles wander within radius
                type: "path", 
            },
            position: {
                x: 70, // Horizontal % (0-100)
                y: 50, // Vertical % (0-100)
            },
            scale: 1, // Resize mask (0.5 = half size, 2 = double size)
            // "inline": particles stick to path lines
            // "inside": particles fill inside of shape
            // "outside": particles stay outside shape
            type: "inline", 
            url: "/shield.svg", // Path to SVG mask
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
