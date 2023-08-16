import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
