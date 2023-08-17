import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(
    email: string,
    firstName: string,
    lastName: string,
    patronymic: string,
    password: string,
    age: number,
  ): Promise<User> {
    const existUser = await this.userRepository.findOne({ where: { email } });

    if (existUser) {
      throw new BadRequestException('This email is already registered!');
    }

    const user = await this.userRepository.create({
      email,
      firstName,
      lastName,
      patronymic,
      password,
      age,
    });

    await user.generateToken();
    return await this.userRepository.save(user);
  }

  async loginUser(email: string, password: string): Promise<User> {
    const existUser = await this.userRepository.findOne({ where: { email } });

    if (!existUser) {
      throw new NotFoundException('This email not found!');
    }

    const isMatch = await existUser.checkPassword(password);

    if (!isMatch) {
      throw new NotFoundException('Password is wrong');
    }

    await existUser.generateToken();
    return await this.userRepository.save(existUser);
  }

  async editUser(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    patronymic: string,
    password: string,
    age: number,
  ) {
    const existUser = await this.userRepository.findOne({ where: { id } });

    if (!existUser) {
      throw new BadRequestException('User not found!');
    }
  }

  async logoutUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    await user.generateToken();
    await this.userRepository.save(user);
    return { message: 'Logout success' };
  }

  private async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('This email not found!');
    }

    return user;
  }
}
