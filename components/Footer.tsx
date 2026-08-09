import { GroupMeIcon, LinkedInIcon } from './Icons';

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
                        <a href="https://groupme.com/join_group/110490963/bxseYw8L" target="_blank" rel="noopener noreferrer" className="tap-scale flex size-11 items-center justify-center rounded-xl text-gray-400 hover:bg-white hover:text-[#00AFF0]">
                            <span className="sr-only">GroupMe</span>
                            <GroupMeIcon size={20} />
                        </a>
                        <a href="https://www.linkedin.com/company/vaisi" target="_blank" rel="noopener noreferrer" className="tap-scale flex size-11 items-center justify-center rounded-xl text-gray-400 hover:bg-white hover:text-[#0A66C2]">
                            <span className="sr-only">LinkedIn</span>
                            <LinkedInIcon size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
