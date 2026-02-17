import { ErrorView } from '@/components/error-view';

export default function NotFound() {
    return <ErrorView title="Page Not Found" message="You stumbled into a nonexistent page." />;
}
