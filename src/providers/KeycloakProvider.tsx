'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { KeycloakContext } from '@/context/KeycloakContext';
import { KeycloakUser, TokenData, KeycloakConfig } from '@/types/auth';
import { getStoredTokens, saveTokens, clearAuthData, refreshTokens, handleCodeExchange } from '@/utils/authHelpers';

type KeycloakProviderProps = {
    children: ReactNode;
    keycloakConfig: KeycloakConfig;
    publicRoutes?: string[];
};

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({
                                                                      children,
                                                                      keycloakConfig,
                                                                      publicRoutes = ['/auth/signin',"/", '/register', '/forgot-password', '/callback'],
                                                                  }) => {
    const [user, setUser] = useState<KeycloakUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tokens, setTokens] = useState<TokenData | null>(null);
    const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            try {
                const storedTokens = await getStoredTokens();
                const urlParams = new URLSearchParams(window?.location?.search || '');
                const code = urlParams.get('code');

                if (code && pathname === '/callback') {
                    await handleCodeExchange(code, keycloakConfig, setTokens, setUser, setIsAuthenticated, router);
                    return;
                }
                if (storedTokens) {
                    if (Date.now() < storedTokens.expires_at) {
                        setTokens(storedTokens);
                        setIsAuthenticated(true);
                        console.log("ICI",isAuthenticated);
                    } else if (storedTokens.refresh_token) {
                        await refreshTokens(storedTokens.refresh_token, keycloakConfig, setTokens, setUser, setIsAuthenticated);
                    } else {
                        clearAuthData(setTokens, setUser, setIsAuthenticated);
                    }
                } else {
                    clearAuthData(setTokens, setUser, setIsAuthenticated);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError('Failed to initialize authentication');
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [pathname]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated && publicRoutes.includes(pathname)) {
            router.push('/auth/signin');
        }
        if (isAuthenticated && publicRoutes.includes(pathname)){
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, pathname]);

    const loginWithGoogle = () => {
        window.location.href = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth?client_id=${keycloakConfig.clientId}&redirect_uri=${window.location.origin}/callback&response_type=code&scope=openid&kc_idp_hint=google`;
    };

    const loginWithGitHub = () => {
        window.location.href = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth?client_id=${keycloakConfig.clientId}&redirect_uri=${window.location.origin}/callback&response_type=code&scope=openid&kc_idp_hint=github`;
    };

    return (
        <KeycloakContext.Provider value={{ user, isAuthenticated, isLoading, error, loginWithGoogle, loginWithGitHub }}>
            {children}
        </KeycloakContext.Provider>
    );
};
