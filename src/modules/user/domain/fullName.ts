import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface FullNameProps {
  value: string;
}

export class FullName extends ValueObject<FullNameProps> {
  public static maxLength: number = 50;
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: FullNameProps) {
    super(props);
  }

  public static create(props: FullNameProps): Result<FullName> {
    const nameResult = Guard.againstNullOrUndefined(props.value, "Name");
    if (nameResult.isFailure) {
      return Result.fail<FullName>(nameResult.getErrorValue());
    }

    const whiteSpaceCheck = Guard.againstOnlyWhitespace(props.value, "Name");
    if (whiteSpaceCheck.isFailure) {
      return Result.fail<FullName>(`Name cannot be empty, value received contain only white space characters`);
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.value);
    if (minLengthResult.isFailure) {
      return Result.fail<FullName>(`Name must be at least ${this.minLength} characters long, value received: ${props.value}`);
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.value);
    if (maxLengthResult.isFailure) {
      return Result.fail<FullName>(`Name must not be more than ${this.maxLength} characters long`);
    }

    return Result.ok<FullName>(new FullName(props));
  }
}
