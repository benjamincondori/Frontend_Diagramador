import { Component } from '@angular/core';
import { InputModalService } from '../../services/input-modal.service';
import { ValidatorsService } from '../../services/validators.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.css']
})
export class InputModalComponent {

  inputForm!: FormGroup;
  
  constructor(
    private inputModalService: InputModalService,
    private validatorsService: ValidatorsService,
    private fb: FormBuilder,
  ) {}
  
  ngOnInit(): void {
    
    this.inputForm = this.fb.group({
      name: ['', Validators.required],
    })
  }
  
  get isOpen(): boolean {
    return this.inputModalService.isOpen;
  }
  
  onSubmit(): void {
    if (this.inputForm.invalid) {
      this.inputForm.markAllAsTouched();
      return;
    }
    const text = this.inputForm.get('name')?.value;
    this.inputModalService.setText(text);
    this.closeModal();
  }
  
  closeModal(): void {
    this.inputModalService.closeModal();
    this.inputForm.reset();
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.inputForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.inputForm, field);
  }
  
}
