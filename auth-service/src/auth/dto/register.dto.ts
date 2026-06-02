import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Validate } from 'class-validator';
import { IsLettersOnlyConstraint } from './validators/is-letters-only.validator';
import { IsValidEmailDomainConstraint } from './validators/is-valid-email-domain.validator';
import { IsValidPasswordConstraint } from './validators/is-valid-password.validator';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Validate(IsLettersOnlyConstraint)
  first_name!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @Validate(IsLettersOnlyConstraint)
  last_name!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Validate(IsValidEmailDomainConstraint)
  email!: string;

  @ApiProperty({ example: 'password12' })
  @IsString()
  @IsNotEmpty()
  @Validate(IsValidPasswordConstraint)
  password!: string;
}