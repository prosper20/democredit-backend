import { AppError } from "../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { JWTToken, RefreshToken } from "../../../../shared/domain/jwt";
import { UserEmail } from "../../domain/userEmail";
import { UserPassword } from "../../domain/userPassword";
import { User } from "../../domain/user";
import { IUserRepo } from "../../repos/IRepo";
import { IAuthService } from "../../services/authService";
import { LoginDTO, LoginResponse } from "./LoginDTO";
import { LoginUseCaseErrors } from "./LoginErrors";

type Response = Either<
  LoginUseCaseErrors.IncorrectPasswordError | LoginUseCaseErrors.EmailDoesntExistError | AppError.UnexpectedError,
  Result<LoginResponse>
>;

export class LoginUserUseCase implements UseCase<LoginDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(request: LoginDTO): Promise<Response> {
    try {
      const emailOrError = UserEmail.create(request.email);
      const passwordOrError = UserPassword.create({ value: request.password });

      if (emailOrError.isFailure) {
        return left(new LoginUseCaseErrors.EmailDoesntExistError());
      }

      const email = emailOrError.getValue();
      let user: User;
      try {
        user = await this.userRepo.getUserByEmail(email.value);
      } catch (error) {
        return left(new LoginUseCaseErrors.EmailDoesntExistError());
      }

      const password = passwordOrError.getValue();
      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        return left(new LoginUseCaseErrors.IncorrectPasswordError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        userId: user.userId.getStringValue(),
        email: user.email.value,
        fullname: user.fullName.value,
        role: user.role as string,
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);
      await this.authService.saveAuthenticatedUser(user);

      return right(
        Result.ok<LoginResponse>({
          accessToken,
          user: {
            userId: user.userId.getStringValue(),
            fullName: user.fullName.value,
            mobileNumber: user.mobileNumber.value,
            role: user.role as string,
            email: user.email.value,
            createdAt: user.createdAt.toISOString(),
          },
        }),
      );
    } catch (err) {
      return left(new AppError.UnexpectedError((err as Error).toString()));
    }
  }
}
