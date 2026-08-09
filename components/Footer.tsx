import Image from 'next/image';
import { Mail, Instagram } from 'lucide-react';
import { LinkedInIcon } from './Icons';

export default function Footer() {
    return (
        <footer className="bg-[#232D4B] border-t border-white/[0.10] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-white/50">
                            {new Date().getFullYear()} Virginia AI Security Initiative.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="https://lists.virginia.edu/sympa/subscribe/vaisi_announcements" target="_blank" rel="noopener noreferrer" className="tap-scale flex size-11 items-center justify-center rounded-xl text-white hover:bg-white/10">
                            <span className="sr-only">Mailing List</span>
                            <Mail size={20} className="opacity-60 hover:opacity-100 transition-opacity" />
                        </a>
                        <a href="https://groupme.com/join_group/110490963/bxseYw8L" target="_blank" rel="noopener noreferrer" className="tap-scale flex size-11 items-center justify-center rounded-xl hover:bg-white/10">
                            <span className="sr-only">GroupMe</span>
                            <Image src="/groupme.png" alt="" width={20} height={20} className="invert opacity-60 hover:opacity-100 transition-opacity" />
                        </a>
                        <a href="https://www.instagram.com/vaisi_atuva/" target="_blank" rel="noopener noreferrer" className="tap-scale flex size-11 items-center justify-center rounded-xl text-white hover:bg-white/10">
                            <span className="sr-only">Instagram</span>
                            <Instagram size={20} className="opacity-60 hover:opacity-100 transition-opacity" />
                        </a>
                        <a href="https://www.linkedin.com/company/vaisi/" target="_blank" rel="noopener noreferrer" className="tap-scale flex size-11 items-center justify-center rounded-xl text-white hover:bg-white/10">
                            <span className="sr-only">LinkedIn</span>
                            <LinkedInIcon size={20} className="opacity-60 hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
