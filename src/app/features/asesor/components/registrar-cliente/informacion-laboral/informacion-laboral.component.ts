import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-informacion-laboral',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './informacion-laboral.component.html',
})
export class InformacionLaboralComponent implements OnInit, OnChanges {
  // 🧠 Formulario reactivo
  form: FormGroup;

  // 📤 Emisores hacia el componente padre
  @Input() datosIniciales: any; // ← AGREGAR ESTO para modo edición
  @Output() formChange = new EventEmitter<any>();
  // @Output() nextTab = new EventEmitter<void>();

  constructor(private fb: FormBuilder) { 
    // ✅ Inicializamos el formulario con validaciones completas
    this.form = this.fb.group({
      nombreEmpresa: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]],
      direccionEmpresa: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      paisEmpresa: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      departamentoEmpresa: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      ciudadEmpresa: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      telefonoEmpresa: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]+$/)
      ]],
      ext: ['', [
        Validators.minLength(1),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]*$/)
      ]],
      celularEmpresa: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]+$/)
      ]],
      correoLaboral: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
    });
  }

  ngOnInit() {
    // ← AGREGAR ESTE MÉTODO para cargar datos iniciales
    if (this.datosIniciales) {
      console.log('📥 Cargando datos iniciales en Información Laboral:', this.datosIniciales);
      this.form.patchValue(this.datosIniciales);
    }

    // 🔁 Emitir cambios válidos al padre automáticamente
    // this.form.valueChanges.subscribe(() => {
    //   if (this.form.valid) {
    //     this.formChange.emit(this.form.value);
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detectar cambios en datosIniciales cuando se cambia de pestaña
    if (changes['datosIniciales'] && !changes['datosIniciales'].firstChange) {
      if (this.datosIniciales) {
        console.log('🔄 Actualizando datos en Información Laboral:', this.datosIniciales);
        this.form.patchValue(this.datosIniciales);
      }
    }
  }
   guardarSeccion() {
    if (this.form.valid) {
      this.formChange.emit(this.form.value);
      // this.nextTab.emit();
      alert('✅ Datos personales guardados correctamente');
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

  // 💾 Guardar sección y avanzar
  // guardarSeccion(): void {
  //   if (this.form.valid) {
  //     this.formChange.emit(this.form.value);
  //     this.nextTab.emit();
  //     alert('Sección de Información Laboral guardada correctamente ✅');
  //   } else {
  //     this.form.markAllAsTouched();
  //     alert('Por favor complete todos los campos obligatorios ⚠️');
  //   }
  // }
}
