import { configValidationSchema } from './config.schema';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configurationService: ConfigService) => {
        const isProduction = configurationService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configurationService.get('DB_HOST'),
          port: configurationService.get('DB_PORT'),
          username: configurationService.get('DB_USERNAME'),
          password: configurationService.get('DB_PASSWORD'),
          database: configurationService.get('DB_DATABASE'),
        };
      },
    }),
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
