import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true
        }),
    ]
})

