import { useEffect, useState, useCallback, useRef } from "react";

import { useAuth } from "./use-auth.js";

import { loadGoogleScript } from "../lib/utils.js";

export function useGoogleAuth() {
  const auth = useAuth()
  const [ready, setReady] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const shopDataRef = useRef({ shopName: "", shopCode: "" });

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) return

    loadGoogleScript().then(() => {
      setReady(true);
    });
  }, [auth]);

  const signIn = useCallback((shopname: string, shopcode: string) => {
    if (ready) {
      shopDataRef.current = { shopName: shopname, shopCode: shopcode }
      setAuthenticating(true)

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      const client = google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'openid email profile',
        ux_mode: 'popup',
        callback: ({ code, error }) => {
          if (error || !code) {
            return;
          }
          auth.authenticate(code, shopDataRef.current.shopName, shopDataRef.current.shopCode);
          setAuthenticating(false)
        },
      });

      client.requestCode();
    }
  }, [ready]);

  return { ready, signIn, authenticating };
}
