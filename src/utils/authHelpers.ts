import { TokenData, KeycloakUser, KeycloakConfig } from '@/types/auth';

export const getStoredTokens = async (): Promise<TokenData | null> => {
    if (typeof window === 'undefined') return null;
    try {
        return JSON.parse(localStorage.getItem('keycloak_tokens') || 'null');
    } catch {
        return null;
    }
};

export const saveTokens = (tokenData: TokenData) => {
    if (typeof window === 'undefined') return;
    const updatedTokenData = { ...tokenData, expires_at: Date.now() + tokenData.expires_in * 1000 };
    localStorage.setItem('keycloak_tokens', JSON.stringify(updatedTokenData));
    return updatedTokenData;
};

export const clearAuthData = (
    setTokens: (tokens: TokenData | null) => void,
    setUser: (user: KeycloakUser | null) => void,
    setIsAuthenticated: (auth: boolean) => void
) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('keycloak_tokens');
    }
    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);
};

export const refreshTokens = async (
    refreshToken: string,
    keycloakConfig: KeycloakConfig,
    setTokens: (tokens: TokenData | null) => void,
    setUser: (user: KeycloakUser | null) => void,
    setIsAuthenticated: (auth: boolean) => void
) => {
    try {
        const response = await fetch(
            `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: keycloakConfig.clientId,
                    client_secret: keycloakConfig.secret,
                    refresh_token: refreshToken,
                }),
            }
        );

        if (!response.ok) throw new Error('Failed to refresh tokens');

        const tokenData = await response.json();
        saveTokens(tokenData);
        setIsAuthenticated(true);
    } catch {
        clearAuthData(setTokens, setUser, setIsAuthenticated);
    }
};

export const handleCodeExchange = async (
    code: string,
    keycloakConfig: KeycloakConfig,
    setTokens: (tokens: TokenData | null) => void,
    setUser: (user: KeycloakUser | null) => void,
    setIsAuthenticated: (auth: boolean) => void,
    router: any
) => {
    try {
        const response = await fetch(
            `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: keycloakConfig.clientId,
                    client_secret: keycloakConfig.secret,
                    code,
                    redirect_uri: keycloakConfig.redirectUri || window.location.origin + '/callback',
                }),
            }
        );

        if (!response.ok) throw new Error('Failed to exchange code for tokens');

        const tokenData = await response.json();
        saveTokens(tokenData);
        setIsAuthenticated(true);
        router.push('/dashboard');
    } catch {
        setIsAuthenticated(false);
        router.push('/login');
    }
};
