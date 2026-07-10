import * as AuthSession from "expo-auth-session";

export const tenantId = "53f54b36-c038-4489-a1f7-5df9e0e6b9e2";
export const clientId = "ddd11fb3-729b-4283-b221-6442396b5d79";
export const tenantName = "mobalabbsgmail";

// Replace with your actual user flow name
export const userFlow = "B2X_1_email_with_password";

export const redirectUri = AuthSession.makeRedirectUri({
  scheme: "gameon",
  path: "auth",
});

export const discovery = {
    authorizationEndpoint: `https://${tenantName}.ciamlogin.com/${tenantId}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://${tenantName}.ciamlogin.com/${tenantId}/oauth2/v2.0/token`,
//     authorizationEndpoint: `https://${tenantName}.ciamlogin.com/${tenantId}/oauth2/v2.0/authorize`,
//   tokenEndpoint: `https://${tenantName}.ciamlogin.com/${tenantId}/oauth2/v2.0/token`,
//   authorizationEndpoint: `https://${tenantName}.ciamlogin.com/${tenantId}/${userFlow}/oauth2/v2.0/authorize`,
//   tokenEndpoint: `https://${tenantName}.ciamlogin.com/${tenantId}/${userFlow}/oauth2/v2.0/token`,
};