'use client';

import { useKeycloak } from '@/hooks/useKeycloak';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useKeycloak();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/signin');
        }
    }, [isAuthenticated, isLoading]);

    return isAuthenticated ? children : <p>Chargement...</p>;
};

export default ProtectedRoute;
