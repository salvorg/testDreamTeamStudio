import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsOptional,
  Matches,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Поле email не должно быть пустым' })
  email: string;

  @IsNotEmpty({ message: 'Поле пароля не должно быть пустым' })
  @IsString({ message: 'Поле пароля должно быть строкой' })
  @Length(8, 20, { message: 'Пароль должен содержать от 8 до 20 символов' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
    {
      message:
        'Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву, одну цифру и один специальный символ',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'Поле имени не должно быть пустым' })
  @IsString({ message: 'Поле имени должно быть строкой' })
  @Matches(/^[a-zA-Zа-яА-Я-]+$/, { message: 'Некорректный формат имени' })
  firstName: string;

  @IsNotEmpty({ message: 'Поле фамилии не должно быть пустым' })
  @IsString({ message: 'Поле фамилии должно быть строкой' })
  @Matches(/^[a-zA-Zа-яА-Я-]+$/, { message: 'Некорректный формат фамилии' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'Поле отчества должно быть строкой' })
  @Matches(/^[a-zA-Zа-яА-Я-]+$/, { message: 'Некорректный формат отчества' })
  patronymic: string;

  @IsNotEmpty({ message: 'Поле age не должно быть пустым' })
  @IsInt({ message: 'Поле age должно быть числом' })
  @Min(0)
  age: number;
}
