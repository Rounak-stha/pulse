import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { BuilderEditor } from './components/CraftBuilder.js';

export const Route = createFileRoute('/_builder/builder')({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: BuilderPage,
    loader: () => ({ breadcrumb: () => <Trans>Builder</Trans> }),
});

function BuilderPage() {
    return <BuilderEditor pageId="" />;
}
