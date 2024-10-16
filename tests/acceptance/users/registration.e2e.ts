import { LoginDTO } from "src/modules/users/useCases/login/LoginDTO";
import { RegisterUserDTO } from "src/modules/users/useCases/register/RegisterUserDTO";

import { redisConnection } from "../../../src/modules/users/services/redis/redisConnection";
import { CompositionRoot } from "../../../src/shared/composition/compositionRoot";
import { RESTfulAPIDriver } from "../../../src/shared/http/restfulAPIDriver";
import { UserBuilder } from "../../../src/shared/tests/users/builders/userBuilder";

describe("Auth End-to-End Tests", () => {
  let registerUserInput: RegisterUserDTO;
  let CreateLoginUserInput: RegisterUserDTO;
  let loginUserInput: LoginDTO;
  let restfulAPIDriver: RESTfulAPIDriver;
  let server: any;
  let response: any;

  beforeAll(async () => {
    const compositionRoot: CompositionRoot = new CompositionRoot();
    server = compositionRoot.getWebServer();
    await server.start();
    restfulAPIDriver = new RESTfulAPIDriver(server.getHttp());
  });

  test("Successful registration", async () => {
    registerUserInput = new UserBuilder()
      .withRandomName()
      .withMobileNumber("23456323456")
      .withRandomEmail()
      .withRandomRole()
      .withPassword("QWerty@78")
      .withPasswordConfirm("QWerty@78")
      .build();

    response = await restfulAPIDriver.post("/auth/register", registerUserInput);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  }, 10000);

  test("Successful login", async () => {
    CreateLoginUserInput = new UserBuilder()
      .withRandomName()
      .withMobileNumber("23456323456")
      .withRandomEmail()
      .withRandomRole()
      .withPassword("QWerty@78")
      .withPasswordConfirm("QWerty@78")
      .build();

    await restfulAPIDriver.post("/auth/register", CreateLoginUserInput);

    loginUserInput = {
      email: CreateLoginUserInput.email,
      password: "QWerty@78",
    };

    response = await restfulAPIDriver.post("/auth/login", loginUserInput);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user).toBeDefined();
  }, 10000);

  afterAll(async () => {
    await server.stop();
    await redisConnection.quit();
  });
});