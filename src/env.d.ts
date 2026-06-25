/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "@fontsource-variable/*";

interface ImportMetaEnv {
    readonly GITHUB_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}