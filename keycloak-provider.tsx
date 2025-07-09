import { PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import Keycloak from 'keycloak-js';
import { KeycloakContext } from './keycloak-context';

export const useToken = () => {
  const contextValue = useContext(KeycloakContext);

  return contextValue?.token;
}

export interface KeycloakContextProviderProps {
  url: string;
  realm: string;
  clientId: string;
}

export const KeycloakContextProvider = (props: PropsWithChildren<KeycloakContextProviderProps>) => {
  const { children, clientId, realm, url } = props;
  const [keycloak] = useState(() => {
    return new Keycloak({
      url,
      realm,
      clientId,
    });
  });
  const initializingRef = useRef(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initializingRef.current) {
      keycloak.init()
        .then((logged) => {
          setInitialized(logged);
          if (!logged) {
            keycloak.login();
          }
        })
        .catch(() => {
        })
      initializingRef.current = true;
    }
  }, []);

  return (
    <KeycloakContext.Provider value={keycloak}>
      {initialized && children}
    </KeycloakContext.Provider>
  );
}
