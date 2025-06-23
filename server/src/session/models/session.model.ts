import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType() // Output from server to client; Used with @Query() and @Mutation() return types
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
