import { JWTToken } from "../../../../shared/domain/jwt";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: JWTToken;
  user: {
    userId: string;
    fullName: string;
    mobileNumber: string;
    email: string;
    role: string;
    createdAt: string;
  };
}
