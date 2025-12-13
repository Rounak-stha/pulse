import { LoginForm } from '@/vdb/components/login/login-form.js';
import { useAuth } from '@/vdb/hooks/use-auth.js';
import { createFileRoute, Navigate, redirect, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';

const fallback = '/' as const;

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad: ({ context, search }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: search.redirect || fallback });
        }
    },
    component: LoginPage,
});

function LoginPage() {
    const {
        isAuthenticated,
        googleScriptLoaded,
        signInWithGoogle,
        authenticationError,
        status,
        initializeGoogleScript,
    } = useAuth();
    const isLoading = useRouterState({ select: s => s.isLoading });
    const search = Route.useSearch();

    useEffect(() => {
        initializeGoogleScript();
    }, []);

    if (isAuthenticated) {
        return <Navigate to={search.redirect || fallback} />;
    }

    const isVerifying = isLoading || status === 'verifying';

    return (
        <LoginForm
            googleScriptLoaded={googleScriptLoaded}
            onSubmit={signInWithGoogle}
            isVerifying={isVerifying}
            signinError={authenticationError}
        />
    );
}
