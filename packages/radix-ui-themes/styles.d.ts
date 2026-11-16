// Type declarations for the package's CSS entrypoints.
//
// TypeScript 7 (tsgo) enables `noUncheckedSideEffectImports` by default, which
// errors on untyped side-effect imports like `import '@radix-ui/themes/styles.css'`.
// These declarations let CSS imports resolve, so consumers don't have to add
// their own `declare module '*.css'` shim.

declare module '@radix-ui/themes/styles.css';
declare module '@radix-ui/themes/*.css';
