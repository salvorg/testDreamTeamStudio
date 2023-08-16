import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  patronymic: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  age: number;
}
