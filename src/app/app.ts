import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private fb = inject(FormBuilder);
  
  form: FormGroup;
  submittedData: any = null;

  cidades = ['Colatina', 'Marilândia', 'Linhares', 'Vitória', 'Serra', 'Outra'];

  constructor() {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefones: this.fb.array([this.createTelefoneControl()], [this.atLeastOnePhoneValidator]),
      idade: ['', [Validators.required, Validators.min(18)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      genero: ['', Validators.required],
      cidade: ['', Validators.required],
      termos: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  get telefones() {
    return this.form.get('telefones') as FormArray;
  }

  createTelefoneControl() {
    return this.fb.control('', Validators.required);
  }

  addTelefone() {
    this.telefones.push(this.createTelefoneControl());
  }

  removeTelefone(index: number) {
    if (this.telefones.length > 1) {
      this.telefones.removeAt(index);
    }
  }

  // Custom Validator to ensure password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;
    if (senha && confirmarSenha && senha !== confirmarSenha) {
      control.get('confirmarSenha')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Custom Validator for at least one phone
  atLeastOnePhoneValidator(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    if (formArray.length === 0) {
      return { noPhone: true };
    }
    const hasValidPhone = formArray.controls.some(c => c.value && c.value.trim() !== '');
    if (!hasValidPhone) {
      return { noValidPhone: true };
    }
    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.submittedData = this.form.value;
    } else {
      this.form.markAllAsTouched();
    }
  }
  
  resetForm() {
    this.submittedData = null;
    this.form.reset();
    this.telefones.clear();
    this.addTelefone();
  }
}
