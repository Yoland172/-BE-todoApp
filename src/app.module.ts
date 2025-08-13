import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TodoListModule } from './todo-list/todo-list.module';
import { TodoItemModule } from './todo-item/todo-item.module';
import { CloudinaryModule } from './fileUpload/fileUpload.module';
import { PropertyAccessModule } from './property-access/property-access.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => {
        return {
          url: configService.get('DATABASE_URL'),
          type: 'postgres',
          port: 3306,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          // logging: true,
        };
      },
    }),
    AuthModule,
    UserModule,
    TodoListModule,
    TodoItemModule,
    CloudinaryModule,
    PropertyAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
