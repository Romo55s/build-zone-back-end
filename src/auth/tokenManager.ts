interface TokenInfo {
  token: string;
  expiration: number; // Tiempo de expiración del token en milisegundos (timestamp)
}

const revokedTokens: TokenInfo[] = [];

export const TokenManager = {
  getRevokedTokens: () => revokedTokens,
  addRevokedToken: (token: string, expiration: number) => revokedTokens.push({ token, expiration }),
  isTokenRevoked: (token: string) => {
    // Obtener el token correspondiente
    const revokedToken = revokedTokens.find(info => info.token === token);
    if (!revokedToken) {
      return false; // El token no está en la lista de revocados
    }
    // Verificar si el token ha expirado
    return revokedToken.expiration < Date.now(); // Comparar con la hora actual en milisegundos
  },
};
