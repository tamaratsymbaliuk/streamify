import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from '../modules/auth/account/models/user.model';
import type { GqlContext } from '../shared/types/gql-context.types';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  login?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  password: string;
}

@Resolver(() => UserModel)
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => UserModel)
  async loginUser(
    @Context() { req }: GqlContext,
    @Args('data', { type: () => LoginInput }) data: LoginInput,
  ) {
    const user = await this.sessionService.login(req, data);
    return {
      ...user,
      avatar: user.avatar || '',
      bio: user.bio || '',
    } as UserModel;
  }

  @Mutation(() => Boolean)
  async logoutUser(@Context() { req, res }: GqlContext): Promise<boolean> {
    const requestWithRes = Object.assign(req, { res });
    await this.sessionService.logout(requestWithRes);
    return true;
  }
}
