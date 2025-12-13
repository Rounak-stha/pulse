import { createFileRoute, Navigate, redirect, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';

import { SignupForm } from '@/vdb/components/signup/signup-form.js';
import { useAuth } from '@/vdb/hooks/use-auth.js';

const fallback = '/' as const;

export const Route = createFileRoute('/signup')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad: ({ context, search }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: search.redirect || fallback });
        }
    },
    component: SignupPage,
});

function SignupPage() {
    const {
        isAuthenticated,
        googleScriptLoaded,
        signUpWithGoogle,
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

    const isVerifying = isLoading || status == 'verifying';

    return (
        <SignupForm
            googleScriptLoaded={googleScriptLoaded}
            signUpError={authenticationError}
            onSubmit={signUpWithGoogle}
            isVerifying={isVerifying}
        />
    );
}
