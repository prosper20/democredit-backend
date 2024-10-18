import { AggregateRoot, Either, Guard, left, Result, right, UniqueEntityID } from "../../../shared";
import { JWTToken, RefreshToken } from "../../../shared/domain/jwt";
import { FullName } from "./fullName";
import { Role } from "./role";
import { UserEmail } from "./userEmail";
import { UserId } from "./userId";
import { UserPassword } from "./userPassword";
import { MobileNumber } from "./mobileNumber";
import { UserCreated } from "./events/userCreated";

export interface UserProps {
  fullName: FullName;
  mobileNumber: MobileNumber;
  email: UserEmail;
  password: UserPassword;
  role: Role;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get mobileNumber() {
    return this.props.mobileNumber;
  }

  get fullName() {
    return this.props.fullName;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get accessToken() {
    return this.props.accessToken;
  }

  get lastLogin() {
    return this.props.lastLogin;
  }

  get refreshToken() {
    return this.props.refreshToken;
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();

    //dispatch Event: UserLoggedIn
  } 

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.fullName, argumentName: "fullName" },
      { argument: props.mobileNumber, argumentName: "mobileNumber" },
      { argument: props.email, argumentName: "email" },
      { argument: props.password, argumentName: "password" },
      { argument: props.role, argumentName: "role" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props,
      },
      id,
    );

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    return Result.ok<User>(user);
  }
}
