import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import type { SessionMetadata } from '@/shared/types/session-metadata.types'
import { AccountDeletionTemplate } from '../libs/mail/templates/account-deletion.template'
import { DeactivateTemplate } from '../libs/mail/templates/deactivate.template'
import { EnableTwoFactorTemplate } from '../libs/mail/templates/enable-two-factor.template'
import { PasswordRecoveryTemplate } from '../libs/mail/templates/password-recovery.template'
import { VerificationTemplate } from '../libs/mail/templates/verification.template'
import { VerifyChannelTemplate } from '../libs/mail/templates/verify-channel.template'

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) { }

  public async sendVerificationToken(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(VerificationTemplate({ domain, token }))
    return this.sendMail(email, 'Account Verification', html)
  }

  public async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(PasswordRecoveryTemplate({ domain, token, metadata }))
    return this.sendMail(email, 'Password Reset', html)
  }

  public async sendDeactivateToken(email: string, token: string, metadata: SessionMetadata) {
    const html = await render(DeactivateTemplate({ token, metadata }))
    return this.sendMail(email, 'Account Deactivation', html)
  }

  public async sendAcccountDeletion(email: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(AccountDeletionTemplate({ domain }))
    return this.sendMail(email, 'Account Deleted', html)
  }

  public async sendEnableTwoFactor(email: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(EnableTwoFactorTemplate({ domain }))
    return this.sendMail(email, 'Secure Your Account', html)
  }

  public async sendVerifyChannel(email: string) {
    const html = await render(VerifyChannelTemplate())
    return this.sendMail(email, 'Your Channel is Verified', html)
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html
    })
  }
}