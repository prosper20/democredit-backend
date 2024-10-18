import { JWTToken, JWTClaims, RefreshToken } from "../../../shared/domain/jwt";
import { User } from "../domain/user";


export interface IAuthService {
  signJWT(props: JWTClaims, expiresIn?:number): JWTToken;
  decodeJWT(token: string): Promise<JWTClaims>;
  createRefreshToken(): RefreshToken;
  getTokens(email: string): Promise<string[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(email: string): Promise<void>;
  refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>;
  getEmailFromRefreshToken(refreshToken: RefreshToken): Promise<string>;
}
