export type KeycloakUser = {
    sub: string;
    email?: string;
    name?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
    email_verified?: boolean;
    roles?: string[];
};

export type TokenData = {
    access_token: string;
    refresh_token: string;
    id_token: string;
    expires_in: number;
    refresh_expires_in: number;
    token_type: string;
    expires_at: number;
};

export type KeycloakContextType = {
    user: KeycloakUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login?: () => void;
    logout?: () => void;
    getToken?: () => Promise<string | null>;
    hasRole?: (role: string) => boolean;
    error: string | null;
    loginWithGoogle?: () => void;
    loginWithGitHub?: () => void;
};

export type KeycloakConfig = {
    url: string;
    realm: string;
    clientId: string
    secret: string;
    redirectUri?: string;
};
