import { Args, Context, Mutation, Query, Resolver, ObjectType, Field, InputType } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from '../modules/auth/account/models/user.model';
import type { GqlContext } from '../shared/types/gql-context.types';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { UserAgent } from '@/shared/decorators/user-agent.decorator';
import { AuthModel } from '@/modules/auth/account/models/auth.modul';

@InputType() //  Input from client to server; Used with @Args() parameters
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
  constructor(private readonly sessionService: SessionService) { }

  @Mutation(() => AuthModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionService.login(req, input, userAgent)
	}

  @Mutation(() => Boolean)
  async logoutUser(@Context() { req, res }: GqlContext): Promise<boolean> {
    const requestWithRes = Object.assign(req, { res });
    await this.sessionService.logout(requestWithRes);
    return true;
  }

  @Authorization()
  @Mutation(() => Boolean)
  async removeSession(
    @Context() { req }: GqlContext,
    @Args('id') id: string
  ): Promise<boolean> {
    return this.sessionService.remove(req, id);
  }

  @Authorization()
  @Query(() => [SessionModel])
  async findSessionsByUser(@Context() { req }: GqlContext): Promise<SessionModel[]> {
    return this.sessionService.findByUser(req);
  }

  @Authorization()
  @Query(() => SessionModel)
  async findCurrentSession(@Context() { req }: GqlContext): Promise<SessionModel> {
    return this.sessionService.findCurrent(req);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async clearSessionCookie(@Context() { req, res }: GqlContext): Promise<boolean> {
    const requestWithRes = Object.assign(req, { res });
    return this.sessionService.clearSession(requestWithRes);
  }
}

@ObjectType() //  Output from server to client;  Used with @Query() and @Mutation() return types
export class SessionModel {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  userAgent: string;

  @Field()
  ip: string;

  @Field()
  createdAt: number;

  @Field({ nullable: true })
  lastActive?: number;
}
