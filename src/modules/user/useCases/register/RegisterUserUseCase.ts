import { AppError, Either, left, Result, right, UseCase } from "../../../../shared";
import { FullName } from "../../domain/fullName";
import { UserEmail } from "../../domain/userEmail";
import { UserPassword } from "../../domain/userPassword";
import { User } from "../../domain/user";
import { Role } from "../../domain/role";
import { IUserRepo } from "../../repos/IRepo";
import { RegisterUserDTO } from "./RegisterUserDTO";
import { RegisterUserErrors } from "./RegisterUserErrors";
import { MobileNumber } from "../../domain/mobileNumber";
import { checkAdjutorKarmablacklist } from "../../../../shared/utils/KarmaValidation"

type Response = Either<
  | RegisterUserErrors.EmailAlreadyExistsError
  | RegisterUserErrors.PasswordMismatchError
  | RegisterUserErrors.ValidationError
  | RegisterUserErrors.UserBlacklistedError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class RegisterUserUseCase implements UseCase<RegisterUserDTO, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(request: RegisterUserDTO): Promise<Response> {
    try {
      const userBlacklisted = await checkAdjutorKarmablacklist(request.email);
      if (userBlacklisted) {
          return left(new RegisterUserErrors.UserBlacklistedError()) as Response;
      }
    } catch (error) {
      return left(new RegisterUserErrors.ErrorCheckingBlacklist) as Response;
    }

    if (request.password !== request.passwordConfirm) {
      return left(new RegisterUserErrors.PasswordMismatchError()) as Response;
    }

    const fullNameOrError = FullName.create({ value: request.fullName });
    const mobileNumberOrError = MobileNumber.create({value: request.mobileNumber});
    const emailOrError = UserEmail.create(request.email);
    const passwordOrError = UserPassword.create({ value: request.password });

    const dtoResult = Result.combine([fullNameOrError, mobileNumberOrError, emailOrError, passwordOrError]);

    if (dtoResult.isFailure) {
      return left(new RegisterUserErrors.ValidationError(dtoResult.getErrorValue())) as Response;
    }

    const fullName: FullName = fullNameOrError.getValue();
    const mobileNumber: MobileNumber = mobileNumberOrError.getValue();
    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();
    const role: Role = request.role as Role;
    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      const userAlreadyExists = await this.userRepo.exists(email);

      if (userAlreadyExists) {
        return left(new RegisterUserErrors.EmailAlreadyExistsError(email.value)) as Response;
      }

      const userOrError: Result<User> = User.create({
        fullName,
        mobileNumber,
        email,
        password,
        role,
        createdAt,
        updatedAt,
      });

      if (userOrError.isFailure) {
        return left(new RegisterUserErrors.ValidationError(userOrError.getErrorValue().toString())) as Response;
      }

      const user: User = userOrError.getValue();
      await this.userRepo.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
