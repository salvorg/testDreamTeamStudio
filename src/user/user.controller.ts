import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Get,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { CurrentUser } from '../auth/currentUser.decorator';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserBy(id);
  }

  @Post('register')
  registerUser(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.registerUser(
      body.email,
      body.firstName,
      body.lastName,
      body.patronymic,
      body.password,
      body.age,
    );
  }

  @Patch('edit')
  @UseGuards(TokenAuthGuard)
  async editUser(@CurrentUser() user: User, @Body() body: Partial<User>) {
    return this.userService.editUser(user.id, body);
  }

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async loginUser(@Body() body: { email: string; password: string }) {
    return this.userService.loginUser(body.email, body.password);
  }

  @Delete('logout')
  @UseGuards(TokenAuthGuard)
  async logoutUser(@CurrentUser() user: User) {
    return this.userService.logoutUser(user.id);
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard)
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
