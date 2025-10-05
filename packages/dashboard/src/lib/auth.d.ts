// types/google.d.ts
export {};

declare global {
  interface Window {
    google: typeof google;
  }

  namespace google.accounts {
    namespace oauth2 {
      interface TokenClientResponse {
        access_token?: string;
        expires_in?: number;
        token_type?: string;
        error?: string;
      }

      interface CodeClientResponse {
        code?: string;
        error?: string;
      }

      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenClientResponse) => void;
      }

      interface CodeClientConfig {
        client_id: string;
        scope: string;
        ux_mode?: 'popup' | 'redirect';
        callback: (response: CodeClientResponse) => void;
      }

      function initTokenClient(config: TokenClientConfig): {
        requestAccessToken: (opts?: { prompt?: 'consent' | 'none' }) => void;
      };

      function initCodeClient(config: CodeClientConfig): {
        requestCode: () => void;
      };
    }
  }
}
