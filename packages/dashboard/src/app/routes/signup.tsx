import { SignupForm } from '@/vdb/components/signup/signup-form.js';
import { useAuth } from '@/vdb/hooks/use-auth.js';
import { createFileRoute, Navigate, redirect, useRouterState } from '@tanstack/react-router';
import { z } from 'zod';

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
    const auth = useAuth();
    const search = Route.useSearch();

    if (auth.isAuthenticated) {
        return <Navigate to={search.redirect || fallback} />;
    }

    return (
        <SignupForm />
    );
}
