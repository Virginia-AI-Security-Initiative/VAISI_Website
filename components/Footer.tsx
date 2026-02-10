import Link from 'next/link';

import { DiscordIcon, GroupMeIcon, LinkedInIcon } from './Icons';
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
                            {new Date().getFullYear()} Virginia AI Security Initiative.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="https://discord.gg/XyqmJE5emc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#5865F2] transition-colors">
                            <span className="sr-only">Discord</span>
                            <DiscordIcon size={20} />
                        </a>
                        <a href="https://groupme.com/join_group/110490963/bxseYw8L" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00AFF0] transition-colors">
                            <span className="sr-only">GroupMe</span>
                            <GroupMeIcon size={20} />
                        </a>
                        <a href="https://www.linkedin.com/company/vaisi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <LinkedInIcon size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
