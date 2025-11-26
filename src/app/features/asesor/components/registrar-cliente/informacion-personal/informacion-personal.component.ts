import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-informacion-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './informacion-personal.component.html',
})
export class InformacionPersonalComponent {

  form: FormGroup;
  fechaHoy: string;

  // 📤 Emitir datos al padre solo cuando se presione "Guardar"
  @Output() formChange = new EventEmitter<any>();
  @Output() nextTab = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    // Obtener fecha de hoy para limitar fechas futuras
    const today = new Date();
    this.fechaHoy = today.toISOString().split('T')[0];
    this.form = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(/^[0-9]+$/)
      ]],
      lugarExpedicion: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      ciudadNacimiento: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      fechaNacimiento: ['', Validators.required],
      fechaExpedicion: ['', [
        Validators.required,
        this.validarFechaNoFutura()
      ]],
      primerNombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      segundoNombre: ['', [
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
      ]],
      primerApellido: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      segundoApellido: ['', [
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
      ]],
      genero: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      otraNacionalidad: [''],
      estadoCivil: ['', Validators.required],
      grupoEtnico: ['', Validators.required],
    });
  }

  // Validador para fecha no futura
  validarFechaNoFutura() {
    return (control: any) => {
      if (!control.value) return null;
      const fecha = new Date(control.value);
      const hoy = new Date();
      return fecha <= hoy ? null : { fechaFutura: true };
    };
  }

  // ✅ Método manual para guardar (sin bucle de valueChanges)
  guardarSeccion() {
    if (this.form.valid) {
      this.formChange.emit(this.form.value);
      this.nextTab.emit();
      console.log('✅ Datos personales guardados correctamente');
      alert('Sección de Información Personal guardada correctamente ');
    } else {
      this.form.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios.');
    }
  }

  // 🔒 Método para permitir solo letras y espacios
  soloLetras(event: KeyboardEvent) {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    const inputChar = event.key;
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // 🔒 Método para permitir solo números
  soloNumeros(event: KeyboardEvent) {
    const pattern = /^[0-9]$/;
    const inputChar = event.key;
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}


