import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto-personal.component.html',
})
export class ContactoPersonalComponent implements OnInit, OnChanges {
  form: FormGroup;

  // 📤 Emite los datos al padre cuando se guarda
  @Input() datosIniciales: any; // ← AGREGAR ESTO
  @Output() formChange = new EventEmitter<any>();

  // // 📤 Pide avanzar a la siguiente pestaña
  // @Output() nextTab = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      direccion: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      barrio: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]*$/)
      ]],
      departamento: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      ciudad: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      pais: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      telefono: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]+$/)
      ]],
      correo: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      bloqueTorre: ['', [
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9\s]*$/)
      ]],
      aptoCasa: ['', [
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9\s]*$/)
      ]],
    });
  }
  ngOnInit() {
    // ← AGREGAR ESTE MÉTODO
    if (this.datosIniciales) {
      console.log('📥 Cargando datos iniciales en Contacto Personal:', this.datosIniciales);
      this.form.patchValue(this.datosIniciales);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detectar cambios en datosIniciales cuando se cambia de pestaña
    if (changes['datosIniciales'] && !changes['datosIniciales'].firstChange) {
      if (this.datosIniciales) {
        console.log('🔄 Actualizando datos en Contacto Personal:', this.datosIniciales);
        this.form.patchValue(this.datosIniciales);
      }
    }
  }

  // 💾 Guarda la sección y notifica al padre
  guardarSeccion() {
    if (this.form.valid) {
      this.formChange.emit(this.form.value); // igual que informacion-personal
      // this.nextTab.emit(); // pasa automáticamente a la siguiente pestaña
      alert('📤 Datos de contacto guardados correctamente');
    } else {
      this.form.markAllAsTouched();
      alert('⚠️ Por favor completa los campos obligatorios antes de continuar.');
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

  // 🔒 Método para permitir alfanuméricos
  alfanumerico(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z0-9\s]$/;
    const inputChar = event.key;
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}


