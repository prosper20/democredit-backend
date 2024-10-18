import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

export interface MobileNumberProps {
  value: string;
}

export class MobileNumber extends ValueObject<MobileNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: MobileNumberProps) {
    super(props);
  }

  private static isValidMobileNumber(mobileNumber: string) {
    const phoneRegex =
      /^\+?\d{1,3}\s?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}$/;
    return phoneRegex.test(mobileNumber);
  }

  private static format(mobileNumber: string) {
    return mobileNumber.replace(/\D/g, "");
  }

  public static create(props: MobileNumberProps): Result<MobileNumber> {
    if (!this.isValidMobileNumber(props.value)) {
      return Result.fail<MobileNumber>("invalid phone number");
    } else {
      return Result.ok<MobileNumber>(
        new MobileNumber({ value: this.format(props.value) })
      );
    }
  }
}
