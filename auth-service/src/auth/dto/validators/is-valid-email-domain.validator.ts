import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidEmailDomain', async: false })
export class IsValidEmailDomainConstraint implements ValidatorConstraintInterface {
  validate(email: string): boolean {
    if (typeof email !== 'string') return false;

    const allowedDomains = ['.com', '.net', '.org', '.id'];
    for (const domain of allowedDomains) {
      if (email.endsWith(domain)) {
        return true;
      }
    }
    return false;
  }

  defaultMessage(): string {
    return 'Email must end with a valid domain such as .com, .net, .org, or .id.';
  }
}
