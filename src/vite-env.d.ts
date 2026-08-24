export {};

declare global {
  interface Window {
    CrypteraDesktop?: {
      isElectron: boolean;
      getVersion: () => Promise<string>;
      getPlatform: () => Promise<string>;
    };
  }
}
