import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configurationService: ConfigService) => {
        // const isProduction = configurationService.get('STAGE') === 'prod',
        return {
          // ssl: isProduction,
          // extra: {
          //   ssl: isProduction ? 
          // }
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
  ],
})
export class AppModule {}
