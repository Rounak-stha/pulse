import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { getBuilderGlobalQueryOptions } from '@/vdb/providers/builder.js';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { BuilderEditor } from './components/CraftBuilder.js';

export const Route = createFileRoute('/_builder/builder_/globals/$region')({
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
    component: GlobalsBuilderPage,
    loader: async ({ context, params }) => {
        const queryClient = context.queryClient;
        await queryClient.ensureQueryData(getBuilderGlobalQueryOptions(params.region));
        return null;
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function GlobalsBuilderPage() {
    const { region } = Route.useParams();
    return <BuilderEditor region={region} />;
}
