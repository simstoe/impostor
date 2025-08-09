import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css'
})
export class FormInput {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() minLength: string | number = 0;
  @Input() control!: FormControl;
  @Input() submitted = false;

  get showError(): boolean {
    return this.control?.invalid && (this.control?.touched || this.submitted);
  }

  get errorMessage(): string {
    if (this.control?.errors?.['required']) {
      return 'Dieses Feld ist erforderlich.';
    }
    if (this.control?.errors?.['minlength']) {
      return `Mindestens ${this.control.errors['minlength'].requiredLength} Zeichen erforderlich.`;
    }
    return 'Ungültige Eingabe.';
  }
}
