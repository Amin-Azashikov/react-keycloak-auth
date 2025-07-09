import Keycloak from 'keycloak-js';
import React from 'react';

export const KeycloakContext = React.createContext<Keycloak | null>(null);
