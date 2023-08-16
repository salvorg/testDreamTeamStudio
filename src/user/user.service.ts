import { BadRequestException, Injectable } from '@nestjs/common';
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
    await this.getUserByEmail(email);

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

  private async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException({
        email: ['This email is already registered!'],
      });
    }

    return user;
  }
}
