import { Query, Mutation, Args, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model'
import { CreateUserInput } from './inputs/create-user.input';

@Resolver('Account')
export class AccountResolver {
  public constructor(private readonly accountService: AccountService) {}

 @Query(() => [UserModel], { name: 'findAllUsers' }) // get
  public async findAll() {
    return this.accountService.findAll()
  }

  @Mutation(() => Boolean, { name: 'createUser' }) // all others
  public async create(@Args('data') input: CreateUserInput) {
    return this.accountService.create(input);
  }
}