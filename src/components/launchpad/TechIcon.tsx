
import React from 'react';
import StackIcon from 'tech-stack-icons';
import { Cpu } from 'lucide-react';

interface TechIconProps {
    name: string;
    className?: string;
}

/**
 * Mapping of common names to tech-stack-icons keys
 * tech-stack-icons uses lowercase names usually
 */
const techToIconKey = (name: string): string => {
    const map: Record<string, string> = {
        'Next.js': 'nextjs',
        'React': 'reactjs',
        'Tailwind CSS': 'tailwindcss',
        'Node.js': 'nodejs',
        'PostgreSQL': 'postgresql',
        'MongoDB': 'mongodb',
        'Python': 'python',
        'Django': 'django',
        'TypeScript': 'typescript',
        'JavaScript': 'js',
        'AWS': 'aws',
        'Vercel': 'vercel',
        'Docker': 'docker',
        'Firebase': 'firebase',
        'Supabase': 'supabase',
        'Flutter': 'flutter',
        'Swift': 'swift',
        'Kotlin': 'kotlin',
        'GraphQL': 'graphql',
        'Redis': 'redis',
        'Material UI': 'materialui',
        'Redux': 'redux',
    };
    return map[name] || name.toLowerCase().replace(/[\s.]/g, '');
};

export const TechIcon: React.FC<TechIconProps> = ({ name, className = "w-4 h-4" }) => {
    const iconName = techToIconKey(name);

    return (
        <div className={`${className} inline-flex items-center justify-center`} title={name}>
            <StackIcon name={iconName} className="w-full h-full" />
        </div>
    );
};

