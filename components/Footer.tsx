import Link from 'next/link';
import { Twitter, Linkedin } from 'lucide-react';
// Note: Discord icon is not in standard lucide-react export names sometimes, but let's try standard.
// If Discord is missing, we can use a generic link or check docs. Lucide has 'MessageCircle' or similar.
// Actually, Lucide does have 'Discord' in newer versions, or we can use SVG.
// Let's stick to safe icons for now or standard Lucide ones.

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Virginia AI Safety Initiative. All rights reserved.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                            <span className="sr-only">Twitter</span>
                            <Twitter size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin size={20} />
                        </a>
                        {/* Add Discord link if needed, using a generic icon or text if specific icon unavailable */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
