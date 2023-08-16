import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  registerUser(@Body() body: CreateUserDto) {
    return this.userService.registerUser(
      body.email,
      body.firstName,
      body.lastName,
      body.patronymic,
      body.password,
      body.age,
    );
  }
}
