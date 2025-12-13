import dts from 'rollup-plugin-dts';

export default {
    input: 'build/index.d.ts',
    output: { file: 'build/types.d.ts', format: 'es' },
    plugins: [dts()],
};
