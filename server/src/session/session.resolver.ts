import { Args, Context, Mutation, Query, Resolver, ObjectType, Field, InputType } from '@nestjs/graphql';
import type { Request, Response } from 'express';
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

  @Authorization()
  @Mutation(() => Boolean, { name: 'logoutUser' })
  logout(@Context() { req, res }: GqlContext) {
    return this.sessionService.logout(Object.assign(req, { res }))
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  remove(@Context() { req }: GqlContext, @Args('id') id: string) {
    return this.sessionService.remove(req, id)
  }

  @Authorization()
  @Query(() => [SessionModel], { name: 'findSessionsByUser' })
  findByUser(@Context() { req }: GqlContext) {
    return this.sessionService.findByUser(req)
  }

  @Authorization()
  @Query(() => SessionModel, { name: 'findCurrentSession' })
  findCurrent(@Context() { req }: GqlContext) {
    return this.sessionService.findCurrent(req)
  }

  @Mutation(() => Boolean, { name: 'clearSessionCookie' })
  clearSession(@Context() { req, res }: GqlContext) {
    // Instead of trying to combine objects, pass req and res separately to a wrapper method
    return this.clearSessionWrapper(req, res);
  }

  // Helper method to handle the type requirements
  private clearSessionWrapper(req: Request, res: Response): Promise<boolean> {
    // TypeScript sees this as a valid cast because we're creating a new object
    const reqWithRes = { ...req, res } as unknown as Request & { res: Response };
    return this.sessionService.clearSession(reqWithRes);
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

