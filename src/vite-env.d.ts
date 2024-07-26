/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FREEDOM_LOCAL_MAPS_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
