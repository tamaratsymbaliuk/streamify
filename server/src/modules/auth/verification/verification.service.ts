import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import type { Request } from 'express'

import { TokenType, User } from '@../../prisma/generated'
import { PrismaService } from '@/core/prisma/prisma.service'
import { generateToken } from '@/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/shared/utils/session-metadata.util'
import { saveSession } from '@/shared/utils/session.util'

import { MailService } from '@/modules/mail/mail.service'

import { VerificationInput } from './inputs/verification.input'

@Injectable()
export class VerificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailSerivce: MailService
  ) {}

  async verify(req: Request, input: VerificationInput, userAgent: string) {
    const { token } = input
    const existingToken = await this.prismaService.token.findUnique({ where: { token, type: TokenType.EMAIL_VERIFY } })

    if (!existingToken) throw new NotFoundException('Token not found')
    if (new Date(existingToken.expiresIn) < new Date()) throw new BadRequestException('Token has expired')

    // Check if userId exists to handle potential null value
    if (!existingToken.userId) {
      throw new BadRequestException('Invalid token: no user associated')
    }
    
    const user = await this.prismaService.user.update({
      where: { id: existingToken.userId },
      data: { isEmailVerified: true }
    })

    await this.prismaService.token.delete({ where: { id: existingToken.id } })

    const metadata = getSessionMetadata(req, userAgent)
    return saveSession(req, user, metadata)
  }

  async sendVerificationToken(user: User) {
    const verificationToken = await generateToken(this.prismaService, user, TokenType.EMAIL_VERIFY)
    await this.mailSerivce.sendVerificationToken(user.email, verificationToken.token)
    return true
  }
}
