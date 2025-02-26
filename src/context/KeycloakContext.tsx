import { createContext } from 'react';
import { KeycloakContextType } from '@/types/auth';

export const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);
