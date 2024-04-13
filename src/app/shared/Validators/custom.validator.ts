import {
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

export class CustomValidators extends Validators {
  
  // Verify that the value of the control is a valid email
  static emailValid(control: AbstractControl): ValidationErrors | null {
    return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(
      control.value
    )
      ? null
      : { emailValid: true };
  }
  
  // Verify that password contains at least one uppercase letter, one lowercase letter and one number
  static passwordComplexity(control: AbstractControl): ValidationErrors | null {
    return /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
      control.value
    )
      ? null
      : { passwordComplexity: true };
  }

  // Verify that the value of the first control is equal to the value of the second control
  static mustBeEqual(
    nombrePrimerControl: string,
    nombreSegundoControl: string
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const primerControl = group.get(nombrePrimerControl);
      const segundoControl = group.get(nombreSegundoControl);
      if (primerControl?.value !== segundoControl?.value) {
        segundoControl?.setErrors({ mustBeEqual: true });
        return { mustBeEqual: true };
      } else {
        return null
      }
    };
  }
  
  static fileSize(maxSize: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(control.value.size);
      return control.value.size <= maxSize ? null : { fileSize: { requiredLength: maxSize } };
    };
  }
  
  static fileExtension(control: AbstractControl): ValidationErrors | null {
    return /^.*\.(jpg|png|jpeg)$/.test(control.value) ? null : { fileExtension: true };
  }

  static onlyNumbers(control: AbstractControl): ValidationErrors | null {
    return /^\d+$/.test(control.value) ? null : { onlyNumbers: true };
  }
  
  static atLeastOneNumber(control: AbstractControl): ValidationErrors | null {
    return /\d+/.test(control.value) ? null : { toNumber: true };
  }

  static atLeastOneUppercase(
    control: AbstractControl
  ): ValidationErrors | null {
    return /[A-Z]+/.test(control.value) ? null : { atLeastOneUppercase: true };
  }

  static atLeastOneLowercase(
    control: AbstractControl
  ): ValidationErrors | null {
    return /[a-z]+/.test(control.value) ? null : { atLeastOneLowercase: true };
  }
  
}
