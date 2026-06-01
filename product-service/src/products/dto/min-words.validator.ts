import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'minWords', async: false })
export class MinWordsConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if (typeof text !== 'string') return false;
    const wordCount = text.trim().split(' ').filter(word => word.length > 0).length;
    return wordCount >= 3;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Product name must contain at least 3 words.';
  }
}