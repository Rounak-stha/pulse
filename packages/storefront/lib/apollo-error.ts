import { CombinedGraphQLErrors, toErrorLike } from '@apollo/client/errors';

export function handleError(error: ReturnType<typeof toErrorLike>) {
    if (CombinedGraphQLErrors.is(error)) {
        return error.errors?.[0]?.message ?? 'Our backend blinked. Try again.';
    } else {
        return 'Our backend blinked. Try again.';
    }
}
