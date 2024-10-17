import { defineFeature, loadFeature } from 'jest-cucumber';
import { FollowUseCase } from './FollowUseCase';
import { FollowDTO } from './FollowDTO';
import { UseCaseResponse } from '../../../../shared/tests/types/UseCaseResponse';
import path from 'path';
import { testPath } from 'tests/support/path';
import { makeUser } from 'tests/support/factories/makeUser';
import { CompositionRoot } from '../../../../shared/composition/compositionRoot';
import { DatabaseFixture } from 'tests/support/fixtures/database.fixture';
import { FollowBuilder } from 'tests/support/builders/follow.builder';
import { FollowErrors } from './FollowErrors';

const feature = loadFeature(path.join(testPath, './acceptance/users/follow/follow.feature'));

defineFeature(feature, (test) => {
  let followCommand: FollowDTO;
  let application: ReturnType<CompositionRoot['getApplication']>;
  let repositories: ReturnType<CompositionRoot['getRepositories']>;
  let findUserByIdSpy: jest.SpyInstance;
  let isFollowingSpy: jest.SpyInstance;
  let followUserSpy: jest.SpyInstance;

  let databaseFixture: DatabaseFixture;
  let response: UseCaseResponse<FollowUseCase>;

  beforeEach(() => {
    const composition = new CompositionRoot();
    application = composition.getApplication();
    repositories = composition.getRepositories();
    findUserByIdSpy = jest.spyOn(repositories.user, 'findUserByUserId');
    isFollowingSpy = jest.spyOn(repositories.user, 'isFollowing');
    followUserSpy = jest.spyOn(repositories.user, 'followUser');

    databaseFixture = new DatabaseFixture(composition);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('Successfully follow a user', ({ given, when, then }) => {
    given('I am an authenticated user', () => {
      const user = makeUser();
      const followingUser = makeUser();

      followCommand = new FollowBuilder()
        .overrideProps({
          userId: user.id.toString(),
          followingId: followingUser.id.toString(),
        })
        .build();

      databaseFixture.setupWithExistingUsers([user, followingUser]);
    });

    when('I follow another user', async () => {
      response = await application.users.useCases.follow.execute(followCommand);
    });

    then('I should see that I am following him', async () => {
      expect(response.isOk()).toBeTruthy();

      expect(findUserByIdSpy).toHaveBeenCalledTimes(2);
      expect(isFollowingSpy).toHaveBeenCalledTimes(1);
      expect(followUserSpy).toHaveBeenCalledTimes(1);

      const isFollowing = await repositories.user.isFollowing(
        followCommand.userId,
        followCommand.followingId
      );
      expect(isFollowing).toBeTruthy();
    });
  });

  test('The user cannot follow himself', ({ given, when, then }) => {
    given('I am an authenticated user', () => {
      followCommand = new FollowBuilder()
        .overrideProps({
          userId: '1',
          followingId: '1',
        })
        .build();
    });

    when('I follow myself', async () => {
      response = await application.users.useCases.follow.execute(followCommand);
    });

    then('I should be informed that I cannot follow myself', () => {
      expect(response.isOk()).toBeFalsy();
      expect(response.unwrapError()).toBeInstanceOf(FollowErrors.CannotFollowHimselfError);

      expect(findUserByIdSpy).toHaveBeenCalledTimes(0);
      expect(isFollowingSpy).toHaveBeenCalledTimes(0);
      expect(followUserSpy).toHaveBeenCalledTimes(0);
    });
  });

  test("The user that is following doesn't exist", ({ given, when, then }) => {
    given('I am an authenticated user', () => {});

    when("I follow with a user that doesn't exist", async () => {
      followCommand = new FollowBuilder().withRandomProps().build();

      response = await application.users.useCases.follow.execute(followCommand);
    });

    then("I should be informed that the user doesn't exist", () => {
      expect(response.isOk()).toBeFalsy();
      expect(response.unwrapError()).toBeInstanceOf(FollowErrors.UserNotFoundError);

      expect(findUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(isFollowingSpy).toHaveBeenCalledTimes(0);
      expect(followUserSpy).toHaveBeenCalledTimes(0);
    });
  });

  test("The user that is being followed doesn't exist", ({ given, when, then }) => {
    given('I am an authenticated user', () => {
      const user = makeUser();

      followCommand = new FollowBuilder()
        .overrideProps({
          userId: user.id.toString(),
        })
        .build();

      databaseFixture.setupWithExistingUsers([user]);
    });

    when("I follow a user that doesn't exist", async () => {
      response = await application.users.useCases.follow.execute(followCommand);
    });

    then("I should be informed that the user doesn't exist", () => {
      expect(response.isOk()).toBeFalsy();
      expect(response.unwrapError()).toBeInstanceOf(FollowErrors.FollowingUserNotFoundError);

      expect(findUserByIdSpy).toHaveBeenCalledTimes(2);
      expect(isFollowingSpy).toHaveBeenCalledTimes(0);
      expect(followUserSpy).toHaveBeenCalledTimes(0);
    });
  });

  test('The user already follows the other user', ({ given, when, then }) => {
    given('I am an authenticated user', () => {
      const user = makeUser();
      const followingUser = makeUser();

      followCommand = new FollowBuilder()
        .overrideProps({
          userId: user.id.toString(),
          followingId: followingUser.id.toString(),
        })
        .build();

      databaseFixture.setupWithExistingUsers([user, followingUser]);
    });

    when('I follow a user that I am already following', async () => {
      await application.users.useCases.follow.execute(followCommand);
      jest.clearAllMocks();
      response = await application.users.useCases.follow.execute(followCommand);
    });

    then('I should see that I am already following him', () => {
      expect(response.isOk()).toBeFalsy();
      expect(response.unwrapError()).toBeInstanceOf(FollowErrors.AlreadyFollowingError);

      expect(findUserByIdSpy).toHaveBeenCalledTimes(2);
      expect(isFollowingSpy).toHaveBeenCalledTimes(1);
      expect(followUserSpy).toHaveBeenCalledTimes(0);
    });
  });
});
