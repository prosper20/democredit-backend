import { faker } from "@faker-js/faker";
import { RegisterUserDTO } from "src/modules/users/useCases/register/RegisterUserDTO";
import { Role } from "../../../../modules/users/domain/role";

function generateRandomInteger(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export class UserBuilder {
  private props: RegisterUserDTO;

  constructor() {
    this.props = {
      fullName: "",
      mobileNumber: "",
      email: "",
      password: "",
      passwordConfirm: "",
      role: "",
    };
  }

  public withFullName(fullName: string) {
    this.props.fullName = fullName;
    return this;
  }

  public withRandomName() {
    const randomName = `${faker.person.firstName()} ${faker.person.lastName()}`;
    this.props.fullName = randomName;
    return this;
  }

  public withMobileNumber(value: string) {
    this.props.mobileNumber = value;
    return this;
  }

  public withRandomMobileNumber() {
    const mobileNumber = faker.phone.number();
    this.props.mobileNumber = mobileNumber;
    return this;
  }

  public withEmail(value: string) {
    this.props.email = value;
    return this;
  }

  public withRandomEmail() {
    this.props.email = faker.internet.email();
    return this;
  }

  public withPassword(value: string) {
    this.props.password = value;
    return this;
  }

  withPasswordConfirm(value: string) {
    this.props.passwordConfirm = value;
    return this;
  }

  public withRole(value: Role) {
    this.props.role = value;
    return this;
  }

  public withRandomRole() {
    const roles: Role[] = ["USER", "ADMIN"];
    const randomRole = roles[generateRandomInteger(0, roles.length - 1)];
    this.props.role = randomRole;
    return this;
  }

  public build() {
    return this.props;
  }
}
