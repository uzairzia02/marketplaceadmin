'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // Prevents flickering

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            router.push('/'); // Redirects to sign-in if not logged in
        } else {
            setIsLoading(false); // Allow rendering protected content
        }
    }, [router]);

    if (isLoading) {
        return null; // Prevent UI from showing before redirect
    }

    return <>{children}</>;
}
