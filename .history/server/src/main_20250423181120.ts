import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import { RedisStore } from 'connect-redis';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'
//import { graphqlUploadExpress } from 'graphql-upload';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();


// Core NestJS module
import { CoreModule } from './core/core.module'

// Our custom Redis service (extends ioredis)
import { RedisService } from './core/redis/redis.service'

// Util to convert "30d" to milliseconds
import { ms, type StringValue } from './shared/utils/ms.util'

// Utility to safely convert string env vars to booleans
import { parseBoolean } from './shared/utils/parse-boolean.util'

async function bootstrap() {
  // Create the NestJS app instance
  const app = await NestFactory.create(CoreModule, { rawBody: true })

  // Access .env values via ConfigService
  const config = app.get(ConfigService)

  // Access Redis client (custom service)
  const redis = app.get(RedisService)

  /**
   * MIDDLEWARE: cookie-parser
   * Signs cookies using the secret key
   */
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

  /**
   * MIDDLEWARE: graphqlUploadExpress
   * Adds file upload support for GraphQL endpoint
   */
  app.use(config.getOrThrow<string>('GRAPHQL_PREFIX'), graphqlUploadExpress())

  /**
   * GLOBAL VALIDATION PIPE
   * Automatically validates and transforms incoming DTOs (research what DTO is)
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  /**
   * MIDDLEWARE: express-session
   * Uses Redis to store sessions
   */
  // Get the redis client instance from our custom RedisService (which extends ioredis)
  const redisClient = app.get(RedisService);
  const store = new RedisStore({ client: redisClient });
  app.use(
    session({
      store,
      secret: config.getOrThrow<string>('SESSION_SECRET'), // Encrypt session data
      name: config.getOrThrow<string>('SESSION_NAME'), // Session cookie name
      resave: false, // Don't save session if nothing changed
      saveUninitialized: false, // Don't save empty sessions
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')), // Lifetime of cookie
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')), // Prevent client-side access to cookie
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')), // Only send cookie over HTTPS
        sameSite: config.getOrThrow<string>('SESSION_SAME_SITE'), // e.g., 'lax', 'strict', 'none'
      },
      ttl: ms(config.getOrThrow<StringValue>('REDIS_TTL')) // Time to live for Redis keys
    })
  )

  /**
   * ENABLE CORS
   * Allows frontend (e.g., localhost:3000) to send requests with cookies
   */
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie']
  })

  /**
   * START THE SERVER
   * Uses port from .env and logs the running URL
   */
  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
  console.log(`✅ Server is running at: ${config.getOrThrow<string>('APPLICATION_URL')}`)
}

bootstrap()
