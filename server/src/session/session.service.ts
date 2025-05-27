import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PrismaService } from '../core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { saveSession, destroySession } from '../shared/utils/session.util';
import { LoginInput } from './session.resolver';



@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(req: Request, input: LoginInput) {
    // Determine which field to use for login
    const loginValue = input.login || input.username || input.email;
    
    if (!loginValue) {
      throw new UnauthorizedException('Login identifier is required');
    }
    
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: loginValue },
          { email: loginValue }
        ]
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user.password, input.password);
    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await saveSession(req, user);
    return user;
  }

  async logout(req: Request & { res: Response }): Promise<void> {
    await destroySession(req, this.configService);
  }
}
