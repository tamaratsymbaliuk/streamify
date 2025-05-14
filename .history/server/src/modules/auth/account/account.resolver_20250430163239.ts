import { Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model'

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}
}
