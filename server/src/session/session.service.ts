import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PrismaService } from '../core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { saveSession, destroySession } from '../shared/utils/session.util';
import { LoginInput } from './session.resolver';
import { getSessionMetadata } from '../shared/utils/session-metadata.util';
import { RedisService } from '../core/redis/redis.service';




@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  public async login(req: Request, input: LoginInput, userAgent: string) {
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
    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get session metadata from the request and user agent
    const metadata = getSessionMetadata(req, userAgent);

    // Save session with user and metadata
    return saveSession(req, user, metadata);
  }

  async logout(req: Request & { res: Response }): Promise<void> {
    await destroySession(req, this.configService);
  }

  public async findByUser(req: Request) {
    const userId = req.session.userId
    if (!userId) throw new NotFoundException('User not found')

    const keys = await this.redisService.keys('*')

    const userSessions: any[] = []

    for (const key of keys) {
      const sessionData = await this.redisService.get(key)
      if (sessionData) {
        const session = JSON.parse(sessionData)
        if (session.userId === userId) {
          userSessions.push({
            ...session,
            id: key.split(':')[1]
          })
        }
      }
    }

    userSessions.sort((a, b) => b.createdAt - a.createdAt)

    return userSessions.filter(session => session.id !== req.session.id)
  }

  public async findCurrent(req: Request) {
    const sessionId = req.session.id
    const data = await this.redisService.get(`${this.configService.getOrThrow('SESSION_FOLDER')}${sessionId}`)

    if (!data) {
      throw new NotFoundException('Session not found');
    }

    return {
      ...JSON.parse(data),
      id: sessionId
    }
  }

  public async clearSession(req: Request & { res: Response }) {
    req.res.clearCookie(this.configService.getOrThrow('SESSION_NAME'))
    return true
  }

  public async remove(req: Request, id: string) {
    if (req.session.id === id) {
      throw new ConflictException('Cannot delete current session')
    }

    await this.redisService.del(
      `${this.configService.getOrThrow('SESSION_FOLDER')}${id}`
    )

    return true
  }

}
