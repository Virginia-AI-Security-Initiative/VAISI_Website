'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Research', href: '/research' },
    { name: 'Resources', href: '/resources' },
    { name: 'Events', href: '/past-events' },
    { name: 'Get Involved', href: '/get-involved' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="fixed w-full bg-white z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="tap-scale inline-flex min-h-11 items-center">
                            <Image
                                src="/vaisi_full.jpeg"
                                alt="VAISI Logo"
                                width={224}
                                height={112}
                                className="h-14 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            if (item.name === 'Get Involved') {
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="tap-scale inline-flex min-h-9 items-center rounded-full bg-primary px-3.5 text-base font-normal text-white hover:bg-primary/90 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                );
                            }
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`tap-scale inline-flex min-h-10 items-center text-base font-normal text-primary underline underline-offset-4 decoration-2 transition-colors duration-200 ${
                                        isActive
                                            ? 'decoration-secondary'
                                            : 'decoration-transparent hover:decoration-secondary'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="tap-scale relative flex size-11 items-center justify-center rounded-xl text-primary hover:bg-gray-100 transition-colors duration-200"
                            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isOpen}
                            aria-controls="mobile-navigation"
                        >
                            <span
                                className={`absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                                    isOpen ? 'scale-100 opacity-100 blur-0' : 'scale-[0.25] opacity-0 blur-[4px]'
                                }`}
                            >
                                <X size={24} />
                            </span>
                            <span
                                className={`flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                                    isOpen ? 'scale-[0.25] opacity-0 blur-[4px]' : 'scale-100 opacity-100 blur-0'
                                }`}
                            >
                                <Menu size={24} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                id="mobile-navigation"
                aria-hidden={!isOpen}
                className={`md:hidden absolute w-full grid bg-white border-t border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-[grid-template-rows,opacity,transform] duration-200 ease-out ${
                    isOpen
                        ? 'grid-rows-[1fr] translate-y-0 opacity-100'
                        : 'pointer-events-none grid-rows-[0fr] -translate-y-3 opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                tabIndex={isOpen ? 0 : -1}
                                className={`tap-scale flex min-h-11 items-center rounded-xl px-3 text-base font-medium transition-colors duration-200 ${
                                    item.name === 'Get Involved'
                                        ? 'bg-primary text-white font-normal hover:bg-primary/90'
                                        : 'text-primary hover:bg-gray-50'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
