import { MailModule } from '@/modules/mail/mail.module'
import { Module } from '@nestjs/common'

import { VerificationResolver } from './verification.resolver'
import { VerificationService } from './verification.service'
import { PrismaModule } from '@/core/prisma/prisma.module'

@Module({
    imports: [PrismaModule, MailModule],
	providers: [VerificationResolver, VerificationService],
    exports: [VerificationService], // This line is crucial
})
export class VerificationModule {}