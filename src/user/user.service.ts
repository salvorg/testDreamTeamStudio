import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { SALT_WORK_FACTOR } from '../constants';

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
    await this.getUserBy({ email });

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

  async editUser(id: number, body: Partial<User>) {
    const existUser = await this.userRepository.findOne({ where: { id } });

    if (!existUser) {
      throw new BadRequestException('User not found!');
    }

    if (body.password) {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      body.password = await bcrypt.hash(body.password, salt);
    }

    return await this.userRepository.update(id, body);
  }

  async logoutUser(id: number) {
    const user = await this.getUserBy({ id });
    await user.generateToken();
    await this.userRepository.save(user);
    return { message: 'Logout success' };
  }

  async deleteUser(id: number) {
    await this.getUserBy({ id });
    await this.userRepository.delete(id);
    return { message: 'Deleted successfully' };
  }

  async getUserBy(props) {
    const user = await this.userRepository.findOne({ where: props });

    if (props.email) {
      if (user) {
        throw new BadRequestException('This email is already registered!');
      }
      return;
    }

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    return user;
  }
}
