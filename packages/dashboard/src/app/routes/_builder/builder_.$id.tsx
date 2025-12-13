import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { getBuilderPageQueryOptions } from '@/vdb/providers/builder.js';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { BuilderEditor } from './components/CraftBuilder.js';

export const Route = createFileRoute('/_builder/builder_/$id')({
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
    loader: async ({ context, params }) => {
        const queryClient = context.queryClient;
        await queryClient.ensureQueryData(getBuilderPageQueryOptions(params.id));
        return null;
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function BuilderPage() {
    const params = Route.useParams();
    return <BuilderEditor pageId={params.id} />;
}
