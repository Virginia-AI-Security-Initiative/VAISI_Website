import Image from 'next/image';

interface TeamMemberCardProps {
    name: string;
    title: string;
    // imageSrc will be optional or have a default placeholder in real usage
    imageSrc?: string;
}

export default function TeamMemberCard({ name, title, imageSrc }: TeamMemberCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="aspect-square relative w-full mb-4 bg-gray-200 rounded-md overflow-hidden">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-4xl font-light">?</span>
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold text-primary">{name}</h3>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
        </div>
    );
}
