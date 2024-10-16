export interface JWTClaims {
  userId: string;
  fullname: string;
  email: string;
  role: string;
}

export type JWTToken = string;

export type RefreshToken = string;