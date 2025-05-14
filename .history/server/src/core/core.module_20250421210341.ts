import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !I
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