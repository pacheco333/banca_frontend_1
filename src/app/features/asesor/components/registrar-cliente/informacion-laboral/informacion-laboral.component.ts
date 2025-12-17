import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-informacion-laboral',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './informacion-laboral.component.html',
  styleUrl: './informacion-laboral.component.css'
})
export class InformacionLaboralComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input() datosIniciales: any;
  @Output() formChange = new EventEmitter();
  @Output() nextTab = new EventEmitter();

  departamentosEmpresa: string[] = [];
  ciudadesEmpresa: string[] = [];
  colombiaData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      nombreEmpresa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      direccionEmpresa: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      tipoPaisEmpresa: ['Colombia', Validators.required],
      paisEmpresa: ['Colombia'],
      departamentoEmpresa: ['', Validators.required],
      ciudadEmpresa: ['', Validators.required],
      telefonoEmpresa: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern(/^[0-9]+$/)]],
      ext: ['', [Validators.pattern(/^[0-9]{1,10}$/)]],
      celularEmpresa: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^[0-9]+$/)]],
      correoLaboral: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.cargarDepartamentosColombia();
    this.form.get('ciudadEmpresa')?.disable();

    this.form.get('tipoPaisEmpresa')?.valueChanges.subscribe(tipo => {
      console.log('🌍 Tipo de país empresa:', tipo);
      if (tipo === 'Colombia') {
        this.form.get('paisEmpresa')?.setValue('Colombia');
        this.form.get('ciudadEmpresa')?.disable();
      } else {
        this.departamentosEmpresa = [];
        this.ciudadesEmpresa = [];
        this.form.get('paisEmpresa')?.setValue('');
        this.form.get('departamentoEmpresa')?.setValue('');
        this.form.get('ciudadEmpresa')?.setValue('');
        this.form.get('ciudadEmpresa')?.enable(); // Habilitar para otros países
      }
    });

    this.form.get('departamentoEmpresa')?.valueChanges.subscribe(departamento => {
      if (this.esColombiaEmpresa()) {
        this.actualizarCiudades(departamento);
        this.form.get('ciudadEmpresa')?.setValue('');
        if (departamento) {
          this.form.get('ciudadEmpresa')?.enable();
        } else {
          this.form.get('ciudadEmpresa')?.disable();
        }
      }
    });

    this.form.valueChanges.subscribe(valores => {
      this.formChange.emit(valores);
      console.log('💾 Auto-guardando información laboral...');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datosIniciales'] && changes['datosIniciales'].currentValue && this.form) {
      console.log('INFORMACION LABORAL - Datos recibidos:', this.datosIniciales);
      console.log('País Empresa:', this.datosIniciales.paisEmpresa);
      console.log('Departamento Empresa:', this.datosIniciales.departamentoEmpresa);
      console.log('Ciudad Empresa:', this.datosIniciales.ciudadEmpresa);
      
      // Primero determinar el tipo de país
      if (this.datosIniciales.paisEmpresa === 'Colombia') {
        this.form.patchValue({
          ...this.datosIniciales,
          tipoPaisEmpresa: 'Colombia'
        });
        
        // Cargar ciudades si hay departamento
        if (this.datosIniciales.departamentoEmpresa) {
          setTimeout(() => {
            this.actualizarCiudades(this.datosIniciales.departamentoEmpresa);
            setTimeout(() => {
              this.form.patchValue({ ciudadEmpresa: this.datosIniciales.ciudadEmpresa });
            }, 100);
          }, 100);
        }
      } else {
        // Si NO es Colombia
        this.form.patchValue({
          ...this.datosIniciales,
          tipoPaisEmpresa: 'Otro'
        });
        
        // Habilitar ciudad para escritura libre
        this.form.get('ciudadEmpresa')?.enable();
      }
    }
  }

  cargarDepartamentosColombia() {
    console.log('📡 Cargando archivo colombia-data.json para empresa...');
    this.http.get<any[]>('colombia-data.json').subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos para empresa:', data);
        this.colombiaData = data;
        this.departamentosEmpresa = data.map(d => d.departamento);
        console.log('✅ Departamentos de empresa cargados:', this.departamentosEmpresa);
      },
      error: (err) => {
        console.error('❌ Error al cargar departamentos de empresa:', err);
        alert('❌ Error: No se pudo cargar colombia-data.json');
      }
    });
  }

  actualizarCiudades(departamento: string) {
    console.log('🔍 Buscando ciudades de empresa para:', departamento);
    const deptoData = this.colombiaData.find(d => d.departamento === departamento);
    this.ciudadesEmpresa = deptoData ? deptoData.ciudades : [];
    console.log('🏙️ Ciudades de empresa disponibles:', this.ciudadesEmpresa);
  }

  esColombiaEmpresa(): boolean {
    return this.form.get('tipoPaisEmpresa')?.value === 'Colombia';
  }

  guardarSeccion() {
    if (this.form.valid) {
      this.formChange.emit(this.form.value);
      this.nextTab.emit();
      alert('✅ Datos laborales guardados correctamente');
    } else {
      this.form.markAllAsTouched();
      alert('⚠️ Por favor completa todos los campos obligatorios.');
    }
  }

  soloLetras(event: KeyboardEvent) {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' ||
      event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;
    if (!pattern.test(event.key)) event.preventDefault();
  }

  soloNumeros(event: KeyboardEvent) {
    const pattern = /^[0-9]$/;
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' ||
      event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;
    if (!pattern.test(event.key)) event.preventDefault();
  }

  alfanumerico(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z0-9\s]$/;
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' ||
      event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;
    if (!pattern.test(event.key)) event.preventDefault();
  }

  onEnterKey(event: KeyboardEvent, siguienteCampoId: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const siguienteCampo = document.getElementById(siguienteCampoId);
      if (siguienteCampo) siguienteCampo.focus();
    }
  }
}