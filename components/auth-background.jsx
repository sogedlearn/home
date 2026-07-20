'use client';

import { useEffect, useState } from 'react';

const MOLA_IMAGES = [
    '/Multimedia/Images/Molas Guna/Mola 1.jpg',
    '/Multimedia/Images/Molas Guna/Mola 2.jpg',
    '/Multimedia/Images/Molas Guna/Mola 3.jpg',
    '/Multimedia/Images/Molas Guna/Mola 4.jpg',
    '/Multimedia/Images/Molas Guna/Mola 5.jpg',
];

const INTERVAL_MS = 4500;

export default function AuthBackground() {
    const [bg, setBg] = useState({ index: 0, activeLayer: 0, layers: [0, 0] });

    useEffect(() => {
        const timer = setInterval(() => {
            setBg(({ index, activeLayer, layers }) => {
                const nextIndex = (index + 1) % MOLA_IMAGES.length;
                const nextLayer = 1 - activeLayer;
                const nextLayers = [...layers];
                nextLayers[nextLayer] = nextIndex;
                return { index: nextIndex, activeLayer: nextLayer, layers: nextLayers };
            });
        }, INTERVAL_MS);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
            {[0, 1].map((layer) => (
                <img
                    key={layer}
                    src={MOLA_IMAGES[bg.layers[layer]]}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                        layer === bg.activeLayer ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-emerald-950/45 to-black/50 backdrop-blur-[1px]" />
        </div>
    );
}
