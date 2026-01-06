import Image from "next/image";

export default function HeroGraphic({ className = "" }: { className?: string }) {
    return (
        <div className={`relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center ${className}`}>
            <Image
                src="/logo.png"
                alt="Virginia AI Safety Initiative Logo"
                width={500}
                height={500}
                className="object-contain mix-blend-multiply opacity-90"
                priority
            />
        </div>
    );
}
