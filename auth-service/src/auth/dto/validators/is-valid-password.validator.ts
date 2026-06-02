import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isValidPassword', async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (typeof password !== 'string') return false;

    if (password.length < 8) return false;

    for (const char of password) {
      if (char === ' ') return false;
    }

    let digitCount = 0;
    for (const char of password) {
      const code = char.charCodeAt(0);
      if (code >= 48 && code <= 57) {
        digitCount++;
      }
    }
    if (digitCount < 2) return false;

    return true;
  }

  defaultMessage(): string {
    return 'Password must be at least 8 characters, contain no spaces, and have at least 2 digits.';
  }
}