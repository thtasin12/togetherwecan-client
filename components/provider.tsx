import React from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "@/lib/auth-context"

import {Toaster} from "sonner"

export function Provider({children}: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
    
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <AuthProvider>
                {children}
                <Toaster />
            </AuthProvider>
        </GoogleOAuthProvider>
    )
}