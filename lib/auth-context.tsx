"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {api, ApiError} from "./api"
import type {User} from "./types"

type AuthContextValue = {
    user: User | null
    loading: boolean
    refresh: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    register: (Payload: {
        name: string
        email: string
        photoURL: string
        password: string
    }) => Promise<void>

    googleLogin: (credential: string) => Promise<void>

    logout: () => Promise<void>
    updateProfile: (payload: {name: string;photoURL: string}) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null)

    const [loading, setLoading] = useState(true)

    const refresh = async () => {
        try {
            const data = await api<{user: User}>("/api/auth/me")
            setUser(data.user)
        }catch(err) {
            if(err instanceof ApiError && err.status === 401) setUser(null)
            else setUser(null)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    const login = async (email: string, password: string) => {
        await api("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({email, password})
        })
        await refresh()
    }

    const register = async(payload: {name: string; email: string; photoURL: string; password: string}) => {
        await api("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(payload)
        })   
        await refresh()
    }

    const googleLogin = async(credential: string) => {
        await api("/api/auth/google", {
            method: "POST",
            body: JSON.stringify({credential})
        })
        await refresh()
    }

    const logout = async() => {
        await api("/api/auth/logout", {
            method: "POST"
        })
        setUser(null)
    }

    const updateProfile = async(payload: {name: string; photoURL: string}) => {
        await api("/api/users/profile", {
            method: "PUT",
            body: JSON.stringify(payload)
        })
        await refresh()
    }

    return(
        <AuthContext.Provider
        value={{user, loading, refresh, login, register, googleLogin, logout, updateProfile}}
        >
            {children}

        </AuthContext.Provider>
    )

}


export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) throw new Error("useAuth must be used inside AuthProvider")
    return context
}


