'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Courses',
        href: '/courses',
    },
    {
        name: 'Progress',
        href: '/progress',
    },
    {
        name: 'Leaderboard',
        href: '/leaderboard',
    },
    {
        name: 'Rewards',
        href: '/rewards',
    },
];

export function MainNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center space-x-4 lg:space-x-6">
            {navigationItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname === item.href
                            ? 'text-primary'
                            : 'text-muted-foreground'
                    )}
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    );
} 