import path from 'path';
import { pathToFileURL } from 'url';
import { loadEnv, Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import { vendureDashboardPlugin } from './vite/vite-plugin-vendure-dashboard.js';

function runtimeEnvScriptPlugin(): Plugin {
    const scriptTag = '<script src="/env-config.js"></script>';

    return {
        name: 'runtime-env-script-injector',

        // This hook runs just before the final index.html is written to disk
        transformIndexHtml(html: string) {
            // Find the closing </head> tag and insert the script before it.
            // This ensures the script runs before any other bundled scripts.
            return html.replace('<head>', `</head>\n\t${scriptTag}`);
        },
    };
}

/**
 * This config is used for local development
 */
export default ({ mode }: { mode: string }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const adminApiHost = process.env.VITE_ADMIN_API_HOST ?? 'http://localhost:3000';
    const adminApiPort = process.env.VITE_ADMIN_API_PORT ? +process.env.VITE_ADMIN_API_PORT : 'auto';

    process.env.IS_LOCAL_DEV = adminApiHost.includes('localhost') ? 'true' : 'false';

    const vendureConfigPath = process.env.VITEST
        ? // This should always be used for running the tests
          './sample-vendure-config.ts'
        : // This one might be changed to '../dev-server/dev-config.ts' to test ui extensions
          './sample-vendure-config.ts';

    return defineConfig({
        base: '/dashboard/',
        build: {
            outDir: 'build',
            emptyOutDir: true,
        },
        test: {
            globals: true,
            environment: 'jsdom',
            exclude: ['./plugin/**/*', '**/node_modules/**/*'],
        },
        plugins: [
            vendureDashboardPlugin({
                vendureConfigPath: pathToFileURL(vendureConfigPath),
                api: { host: adminApiHost, port: adminApiPort },
                gqlOutputPath: path.resolve(__dirname, './src/lib/graphql/'),
                tempCompilationDir: path.resolve(__dirname, './.temp'),
            }) as any,

            runtimeEnvScriptPlugin(),
        ],
    });
};
