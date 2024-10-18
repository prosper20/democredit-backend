import { Mapper } from "../../../shared/utils/Mapper";
import { User } from "../domain/user";
import { UserDTO } from "../dtos/userDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { FullName } from "../domain/fullName";
import { MobileNumber } from "../domain/mobileNumber";
import { UserEmail } from "../domain/userEmail";
import { UserPassword } from "../domain/userPassword";

export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      userId: user.userId.getValue().toString(),
      fullName: user.fullName.value, 
      mobileNumber: user.mobileNumber.value,
      email: user.email.value,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  public static toDomain(raw: any): User {
    const fullNameOrError = FullName.create({ value: raw.fullname });
    const mobileNumberOrError = MobileNumber.create({value: raw.mobile_number});
    const userEmailOrError = UserEmail.create(raw.email);
    const userPasswordOrError = UserPassword.create({
      value: raw.password,
      hashed: true,
    });

    const userOrError = User.create(
      {
        fullName: fullNameOrError.getValue(),
        mobileNumber: mobileNumberOrError.getValue(),
        email: userEmailOrError.getValue(),
        password: userPasswordOrError.getValue(),
        role: raw.role,
        createdAt: new Date(raw.created_at),
        updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
      },
      new UniqueEntityID(raw.id)
    );

    if (userOrError.isFailure) {
      console.log(userOrError.getErrorValue());
      return null; 
    }

    return userOrError.getValue();
  }

  public static async toPersistence(user: User): Promise<any> {
    let password: string = null;
    if (user.password) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      id: user.userId.getStringValue(),
      fullname: user.fullName.value,
      mobile_number: user.mobileNumber.value,
      email: user.email.value,
      password: password,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt ? user.updatedAt : null,
    };
  }
}
