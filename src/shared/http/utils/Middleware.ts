import { IAuthService } from "../../../../modules/users/services/authService";

export class Middleware {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  private endRequest(status: 400 | 401 | 403, message: string, res: any): any {
    return res.status(status).send({ message });
  }

  public ensureAuthenticated() {
    return async (req: any, res: any, next: any) => {
      let token = req.headers["authorization"];

      if (token) {
        token = req.headers["authorization"].split(" ")[1];
        try {
          const decoded = await this.authService.decodeJWT(token);

          const { email } = decoded;
          const tokens = await this.authService.getTokens(email);

          if (tokens.length !== 0) {
            req.decoded = decoded;
            return next();
          } else {
            return this.endRequest(403, "Auth token not found. Please log in again to refresh your session.", res);
          }
        } catch (error) {
          console.error("Error decoding JWT:", error);
          return this.endRequest(401, "Invalid access token. Please login again.", res);
        }
      } else {
        return this.endRequest(403, "No access token provided. Please login", res);
      }
    };
  }

  public setUsernameFromDecoded() {
    return (req: any, res: any, next: any) => {
      if (req.decoded && req.decoded.username) {
        req.params.username = req.decoded.username;
        next();
      } else {
        return res.status(400).send({ message: "Username not found in decoded token" });
      }
    };
  }
}
