import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isLettersOnly', async: false })
export class IsLettersOnlyConstraint implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    if (typeof text !== 'string') return false;
    for (const char of text) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const isLowerCase = code >= 97 && code <= 122;
      if (!isUpperCase && !isLowerCase) {
        return false;
      }
    }
    return text.length > 0;
  }

  defaultMessage(): string {
    return 'Field must contain letters only (no numbers or special characters).';
  }
}
