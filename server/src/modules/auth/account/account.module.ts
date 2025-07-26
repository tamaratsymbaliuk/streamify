import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { VerificationService } from '../verification/verification.service'
import { PrismaModule } from '@/core/prisma/prisma.module';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [PrismaModule, VerificationModule],
  providers: [AccountResolver, AccountService, VerificationService],
  exports: [AccountService]
})
export class AccountModule {}


