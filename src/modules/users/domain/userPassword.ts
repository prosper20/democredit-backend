import * as bcrypt from "bcrypt-nodejs";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";

export interface IUserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
  public static minLength: number = 8;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IUserPasswordProps) {
    super(props);
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      });
    });
  }

  public isAlreadyHashed() {
    return this.props.hashed;
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, "", null, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  }

  public getHashedValue(): Promise<string> {
    return new Promise((resolve) => {
      if (this.isAlreadyHashed()) {
        return resolve(this.props.value);
      } else {
        return resolve(this.hashPassword(this.props.value));
      }
    });
  }

  private static hasUppercase(text: string): Result<string> {
    const hasUppercase = /[A-Z]/.test(text);

    if (hasUppercase) {
      return Result.ok<string>();
    } else {
      return Result.fail<string>(
        "Password must contain at least one uppercase letter."
      );
    }
  }

  private static hasLowercase(text: string): Result<string> {
    const hasLowercase = /[a-z]/.test(text);

    if (hasLowercase) {
      return Result.ok<string>();
    } else {
      return Result.fail<string>(
        "Password must contain at least one lowercase letter."
      );
    }
  }

  private static hasSpecialChar(text: string): Result<string> {
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(text);

    if (hasSpecialChar) {
      return Result.ok<string>();
    } else {
      return Result.fail<string>(
        "Password must contain at least one special character."
      );
    }
  }

  private static hasNumber(text: string): Result<string> {
    const hasNumber = /\d/.test(text);

    if (hasNumber) {
      return Result.ok<string>();
    } else {
      return Result.fail<string>(
        "Password must contain at least one number."
      );
    }
  }

  public static create(props: IUserPasswordProps): Result<UserPassword> {
    const propsResult = Guard.againstNullOrUndefined(props.value, "password");

    if (propsResult.isFailure) {
      return Result.fail<UserPassword>(propsResult.getErrorValue());
    } else {

      const hasUppercaseOrError = this.hasUppercase(props.value);
      const hasLowercaseOrError = this.hasLowercase(props.value);
      const hasHasNumberOrError = this.hasNumber(props.value);
      const hasSpecialCharOrError = this.hasSpecialChar(props.value);

      const passwordValidation = Guard.combine([
        hasUppercaseOrError,
        hasLowercaseOrError,
        hasHasNumberOrError,
        hasSpecialCharOrError,
      ]);
  
      if (passwordValidation.isFailure) {
        return Result.fail<UserPassword>(passwordValidation.getErrorValue());
      }

      if (!props.hashed) {
        if (!this.isAppropriateLength(props.value)) {
          return Result.fail<UserPassword>(
            "Password must be at least 8 characters long."
          );
        }
      }

      return Result.ok<UserPassword>(
        new UserPassword({
          value: props.value,
          hashed: !!props.hashed === true,
        })
      );
    }
  }
}
