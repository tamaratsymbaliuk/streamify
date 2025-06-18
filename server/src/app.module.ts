import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/auth/account/account.module';
import { SessionModule } from './session/session.module';
import { RedisModule } from './core/redis/redis.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AccountModule, 
    SessionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
