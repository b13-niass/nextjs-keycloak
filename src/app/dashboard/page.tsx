'use client'
import React, {useState} from 'react'
import ProtectedRoute from "@/components/ProtectedRoute";
import {clearAuthData} from "@/utils/authHelpers";
import {KeycloakUser, TokenData} from "@/types/auth";
import {useRouter} from "next/navigation";

export default function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<KeycloakUser | null>(null);
    const [tokens, setTokens] = useState<TokenData | null>(null);
    const router = useRouter();
    const handleLogout = () => {
        clearAuthData(setTokens, setUser, setIsAuthenticated);
        router.push("/auth/signin")
    }
    return (
        <ProtectedRoute>
            <div className="flex flex-row justify-between p-2 w-100">
                <div>Bonjour Dashbord</div>
                <button className="p-6 bg-blue-500" onClick={handleLogout}>Déconnexion</button>
            </div>
        </ProtectedRoute>
    )
}
