import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { AccountModule } from "src/modules/auth/account/account.module";
import { IS_DEV_ENV } from "src/shared/utils/is-dev.util";
//import { getStripeConfig } from './config/stripe.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'


@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true
        }),
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [ConfigModule],
            useFactory: getGraphQLConfig,
            inject: [ConfigService]
        }),
        LivekitModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getGraphQLConfig,
            inject: [ConfigService]
        }),
        StripeModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getStripeConfig,
            inject: [ConfigService]
        }),
        PrismaModule,
        RedisModule,
       // MailModule,
      //  StorageModule,
      //  LivekitModule,
     //   TelegramModule,
     //   StripeModule,
     //  CronModule,
        AccountModule,
       // SessionModule,
     //   ProfileModule,
      //  VerificationModule,
      //  PasswordRecoveryModule,
      //  TotpModule,
      //  DeactivateModule,
     //   StreamModule,
     //   IngressModule,
      //  WebhookModule,
     //  CategoryModule,
      //  ChatModule,
      //  FollowModule,
     //  ChannelModule,
     /   NotificationModule,
        PlanModule,
        TransactionModule,
        SubscriptionModule
    ]
})
export class CoreModule {}

