'use client';

import { useEffect } from 'react';
import AuthService from '@/services/auth';
import { Providers } from '@/app/providers';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Initialize auth service
        const authService = AuthService.getInstance();
        authService.initializeAuth();
    }, []);

    return <Providers>{children}</Providers>;
} 