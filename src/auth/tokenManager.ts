
const revokedTokens: string[] = [];

export const TokenManager = {
  getRevokedTokens: () => revokedTokens,
  addRevokedToken: (token: string) => revokedTokens.push(token),
  isTokenRevoked: (token: string) => revokedTokens.includes(token),
};
