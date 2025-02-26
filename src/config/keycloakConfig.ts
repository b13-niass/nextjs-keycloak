import {KeycloakConfig} from "@/types/auth";

export const keycloakConfig: KeycloakConfig = {
    url: process.env.KEYCLOAK_URL,
    realm: process.env.KEYCLOAK_REALM,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_CLIENT_SECRET,
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/callback' : undefined,
};