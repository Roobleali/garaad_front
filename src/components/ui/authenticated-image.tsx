"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AuthService from '@/services/auth';

interface AuthenticatedImageProps {
    src?: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    fallback?: React.ReactNode;
    loading?: React.ReactNode;
    onError?: () => void;
    onLoad?: () => void;
}

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
    src,
    alt,
    width,
    height,
    className = "",
    fallback = <div className="bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">🖼️</div>,
    loading = <div className="bg-gray-100 dark:bg-gray-800 rounded animate-pulse">Loading...</div>,
    onError,
    onLoad
}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!src) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        const authService = AuthService.getInstance();
        const token = authService.getToken();

        // If it's already a full URL and doesn't need authentication, use it directly
        if (src.startsWith('http') && !src.includes('api.garaad.org/api/media')) {
            setImageUrl(src);
            setIsLoading(false);
            return;
        }

        // For authenticated media URLs, fetch with token
        if (token && src.includes('api.garaad.org/api/media')) {
            fetch(src, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    if (isMounted) {
                        const url = URL.createObjectURL(blob);
                        setImageUrl(url);
                        setError(false);
                        setIsLoading(false);
                        onLoad?.();
                    }
                })
                .catch(err => {
                    console.error('Error loading authenticated image:', err);
                    if (isMounted) {
                        setError(true);
                        setIsLoading(false);
                        onError?.();
                    }
                });
        } else {
            // For non-authenticated URLs, use directly
            setImageUrl(src);
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
            // Cleanup blob URL on unmount
            if (imageUrl && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [src, onLoad, onError]);

    if (isLoading) {
        return <>{loading}</>;
    }

    if (error || !imageUrl) {
        return <>{fallback}</>;
    }

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={() => {
                setError(true);
                onError?.();
            }}
        />
    );
};

export default AuthenticatedImage; 