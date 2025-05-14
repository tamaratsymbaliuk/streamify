import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DE
        })
    ]
})

GraphQLModule.forRootAsync({
  driver: ApolloDriver,
  imports: [ConfigModule],
  useFactory: getGraphQLConfig,
  inject: [ConfigService]
}),
PrismaModule,