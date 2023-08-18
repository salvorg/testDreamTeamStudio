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
  HttpStatus,
  Header,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { CurrentUser } from '../auth/currentUser.decorator';
import { User } from './user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Header('Authorization', 'Bearer YOUR_ACCESS_TOKEN')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserBy(id);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Returns information of newly registered user',
  })
  @ApiCreatedResponse({
    type: CreateUserDto,
    description: 'Returns `CreateUserDto`',
  })
  @ApiBadRequestResponse({
    description: 'Validation errors',
  })
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
  @ApiOperation({
    summary: 'Edit users profile',
    description: 'Returns information of updated user',
  })
  @ApiOkResponse({
    type: User,
    description: 'Returns `User`',
  })
  @ApiBadRequestResponse({
    description: 'Validation errors',
  })
  async editUser(@CurrentUser() user: User, @Body() body: Partial<User>) {
    return this.userService.editUser(user.id, body);
  }

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Log in by email and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Log in successfully',
  })
  async loginUser(@Body() body: { email: string; password: string }) {
    return this.userService.loginUser(body.email, body.password);
  }

  @Delete('logout')
  @UseGuards(TokenAuthGuard)
  @ApiOperation({ summary: 'Log out' })
  async logoutUser(@CurrentUser() user: User) {
    return this.userService.logoutUser(user.id);
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
