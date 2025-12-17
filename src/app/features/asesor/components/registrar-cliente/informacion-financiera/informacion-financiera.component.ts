import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-informacion-financiera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './informacion-financiera.component.html',
})
export class InformacionFinancieraComponent implements OnInit {
  form: FormGroup;

  @Input() datosIniciales: any;
  @Output() formChange = new EventEmitter();
  @Output() nextTab = new EventEmitter();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // ✅ ELIMINAR Validators.pattern - type="number" ya valida
      ingresosMensuales: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(999999999999)
      ]],
      egresosMensuales: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(999999999999)
      ]],
      totalActivos: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(999999999999)
      ]],
      totalPasivos: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(999999999999)
      ]],
    });
  }

  ngOnInit() {
    if (this.datosIniciales) {
      console.log('Cargando datos iniciales en Información Financiera:', this.datosIniciales);
      this.form.patchValue(this.datosIniciales);
    }

    // 🔄 AUTO-GUARDADO: Emitir datos al padre cada vez que cambie el formulario
    this.form.valueChanges.subscribe(valores => {
      this.formChange.emit(valores);
      console.log('Auto-guardando información financiera...', valores);
    });
  }

  guardarSeccion() {
    if (this.form.valid) {
      this.formChange.emit(this.form.value);
      this.nextTab.emit();
      console.log('✅ Datos financieros guardados:', this.form.value);
      alert('✅ Datos financieros guardados correctamente');
    } else {
      this.form.markAllAsTouched();
      const errores = this.obtenerErroresFormulario();
      if (errores.length > 0) {
        alert('⚠️ Por favor corrige los siguientes errores:\n\n' + errores.join('\n'));
      } else {
        alert('⚠️ Por favor completa todos los campos obligatorios.');
      }
      console.log('❌ Formulario inválido:', this.form.errors);
      console.log('Estado de campos:', {
        ingresosMensuales: this.form.get('ingresosMensuales')?.errors,
        egresosMensuales: this.form.get('egresosMensuales')?.errors,
        totalActivos: this.form.get('totalActivos')?.errors,
        totalPasivos: this.form.get('totalPasivos')?.errors
      });
    }
  }

  obtenerErroresFormulario(): string[] {
    const errores: string[] = [];
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && control.invalid && control.touched) {
        const nombreCampo = this.obtenerNombreCampo(key);
        if (control.errors?.['required']) {
          errores.push(`- ${nombreCampo} es obligatorio`);
        }
        if (control.errors?.['min']) {
          errores.push(`- ${nombreCampo} debe ser mayor o igual a 0`);
        }
      }
    });
    return errores;
  }

  obtenerNombreCampo(key: string): string {
    const nombres: { [key: string]: string } = {
      'ingresosMensuales': 'Ingresos mensuales',
      'egresosMensuales': 'Egresos mensuales',
      'totalActivos': 'Total activos',
      'totalPasivos': 'Total pasivos'
    };
    return nombres[key] || key;
  }

  soloNumeros(event: KeyboardEvent) {
    const pattern = /^[0-9]$/;
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' ||
      event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      return;
    }
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  onEnterKey(event: KeyboardEvent, siguienteCampoId: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const siguienteCampo = document.getElementById(siguienteCampoId);
      if (siguienteCampo) {
        siguienteCampo.focus();
      }
    }
  }
}