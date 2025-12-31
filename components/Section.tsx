import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string; // Allow additional classes if needed
    id?: string;
}

export default function Section({ children, className = "", id }: SectionProps) {
    return (
        <section id={id} className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
            {children}
        </section>
    );
}
