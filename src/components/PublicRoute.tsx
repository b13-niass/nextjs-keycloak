'use client';

import { useKeycloak } from '@/hooks/useKeycloak';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useKeycloak();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading]);

    return isAuthenticated ? children : <p>Chargement...</p>;
};

export default PublicRoute;
