import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AsesorService } from '../../../asesor/services/asesor.service';

// Subcomponentes
import { InformacionPersonalComponent } from './informacion-personal/informacion-personal.component';
import { ContactoPersonalComponent } from './contacto-personal/contacto-personal.component';
import { InformacionLaboralComponent } from './informacion-laboral/informacion-laboral.component';
import { InformacionFinancieraComponent } from './informacion-financiera/informacion-financiera.component';
import { ActividadEconomicaComponent } from './actividad-economica/actividad-economica.component';
import { FactaComponent } from './informacion-factca/informacion-factac.component';

@Component({
  selector: 'app-registrar-cliente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    InformacionPersonalComponent,
    ContactoPersonalComponent,
    InformacionLaboralComponent,
    InformacionFinancieraComponent,
    ActividadEconomicaComponent,
    FactaComponent,
  ],
  templateUrl: './registrar-cliente.component.html',
})
export class RegistrarClienteComponent implements OnInit {
  pestanaActiva: string = 'datos-personales';
  modo: 'nuevo' | 'editar' = 'nuevo';
  idCliente: number | null = null;
  cargando: boolean = false;

  clienteData: any = {
    datosPersonales: null,
    contacto: null,
    actividad: null,
    laboral: null,
    financiera: null,
    facta: null,
  };

  datosIniciales: any = {
    datosPersonales: null,
    contacto: null,
    actividad: null,
    laboral: null,
    financiera: null,
    facta: null,
  };

  ordenPestanas = [
    'datos-personales',
    'contacto-personal',
    'info-laboral',
    'facta',
  ];

  constructor(
    private asesorService: AsesorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(Number(id))) {
      this.modo = 'editar';
      this.idCliente = parseInt(id, 10);
      this.cargarClienteExistente(this.idCliente);
    }
  }

cargarClienteExistente(idCliente: number) {
  this.cargando = true;
  
  this.asesorService.obtenerClientePorId(idCliente).subscribe({
    next: (respuesta) => {
      console.log('Respuesta del servidor:', respuesta);

      if (respuesta.success && respuesta.data) {
        const cliente = respuesta.data;
        console.log('Datos del cliente completos:', cliente);

        this.datosIniciales = {
          datosPersonales: {
            tipoDocumento: cliente.tipoDocumento || '',
            numeroDocumento: cliente.numeroDocumento || '',
            lugarExpedicion: cliente.lugarExpedicion || '',
            ciudadNacimiento: cliente.ciudadNacimiento || '',
            fechaNacimiento: cliente.fechaNacimiento || '',
            fechaExpedicion: cliente.fechaExpedicion || '',
            primerNombre: cliente.primerNombre || '',
            segundoNombre: cliente.segundoNombre || '',
            primerApellido: cliente.primerApellido || '',
            segundoApellido: cliente.segundoApellido || '',
            genero: cliente.genero || '',
            nacionalidad: cliente.nacionalidad || '',
            otraNacionalidad: cliente.otraNacionalidad || '',
            estadoCivil: cliente.estadoCivil || '',
            grupoEtnico: cliente.grupoEtnico || '',
          },
          contacto: cliente.contacto ? {
            direccion: cliente.contacto.direccion || '',
            barrio: cliente.contacto.barrio || '',
            tipoPais: cliente.contacto.pais === 'Colombia' ? 'Colombia' : 'Otro',
            pais: cliente.contacto.pais || '',
            departamento: cliente.contacto.departamento || '',
            ciudad: cliente.contacto.ciudad || '',
            telefono: cliente.contacto.telefono || '',
            correo: cliente.contacto.correo || '',
            bloqueTorre: cliente.contacto.bloqueTorre || '',
            aptoCasa: cliente.contacto.aptoCasa || '',
          } : null,
          actividad: cliente.actividad ? {
            profesion: cliente.actividad.profesion || '',
            ocupacion: cliente.actividad.ocupacion || '',
            codigoCIIU: cliente.actividad.codigoCIIU || cliente.actividad.codigoCiiu || '',
            detalleActividad: cliente.actividad.detalleActividad || '',
            numeroEmpleados: cliente.actividad.numeroEmpleados || 0,
          } : null,
          laboral: cliente.laboral ? {
            nombreEmpresa: cliente.laboral.nombreEmpresa || '',
            direccionEmpresa: cliente.laboral.direccionEmpresa || '',
            paisEmpresa: cliente.laboral.paisEmpresa || '',
            departamentoEmpresa: cliente.laboral.departamentoEmpresa || '',
            ciudadEmpresa: cliente.laboral.ciudadEmpresa || '',
            telefonoEmpresa: cliente.laboral.telefonoEmpresa || '',
            ext: cliente.laboral.ext || '',
            celularEmpresa: cliente.laboral.celularEmpresa || '',
            correoLaboral: cliente.laboral.correoLaboral || '',
          } : null,
          financiera: cliente.financiera ? {
            ingresosMensuales: cliente.financiera.ingresosMensuales || '',
            egresosMensuales: cliente.financiera.egresosMensuales || '',
            totalActivos: cliente.financiera.totalActivos || '',
            totalPasivos: cliente.financiera.totalPasivos || '',
          } : null,
          facta: cliente.facta ? {
            esResidenteExtranjero: cliente.facta.esResidenteExtranjero || false,
            pais: cliente.facta.pais || '',
          } : null,
        };

        console.log('DATOS INICIALES MAPEADOS:');
        console.log('- Datos Personales:', this.datosIniciales.datosPersonales);
        console.log('- Contacto:', this.datosIniciales.contacto);
        console.log('- Laboral:', this.datosIniciales.laboral);

        this.clienteData = JSON.parse(JSON.stringify(this.datosIniciales));
        this.cargando = false;
      }
    },
    error: (err) => {
      console.error('Error al cargar cliente:', err);
      alert('No se pudo cargar el cliente para edición');
      this.router.navigate(['/asesor/consultar-cliente']);
      this.cargando = false;
    }
  });
}



  cancelarEdicion() {
    if (confirm('¿Estás seguro de que quieres cancelar la edición? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/asesor/consultar-cliente']);
    }
  }

  cambiarPestana(nombre: string) {
    this.pestanaActiva = nombre;
  }

  irASiguientePestanaActual() {
    const indexActual = this.ordenPestanas.indexOf(this.pestanaActiva);
    if (indexActual < this.ordenPestanas.length - 1) {
      this.pestanaActiva = this.ordenPestanas[indexActual + 1];
    }
  }

  actualizarDatos(nombre: string, data: any) {
    this.clienteData[nombre] = data;
    console.log(`✅ Datos actualizados (${nombre}):`, data);
  }

  manejarNextTab() {
    this.irASiguientePestanaActual();
  }

  datosCompletos(): boolean {
    return Object.values(this.clienteData).every((seccion) =>
      seccion && Object.keys(seccion).length > 0
    );
  }

  registrarCliente() {
    if (!this.datosCompletos()) {
      alert('⚠️ Debes completar todos los módulos antes de ' +
        (this.modo === 'nuevo' ? 'registrar' : 'actualizar') + ' el cliente.');
      return;
    }

    const payload = {
      ...this.clienteData.datosPersonales,
      contacto: this.clienteData.contacto,
      actividad: this.clienteData.actividad,
      laboral: this.clienteData.laboral,
      financiera: this.clienteData.financiera,
      facta: this.clienteData.facta,
    };

    if (this.modo === 'nuevo') {
      this.asesorService.registrarCliente(payload).subscribe({
        next: (res) => {
          console.log('✅ Cliente registrado con éxito:', res);
          alert('Cliente registrado correctamente');
          this.router.navigate(['/asesor/consultar-cliente']);
        },
        error: (err) => {
          console.error('❌ Error al registrar cliente:', err);
          alert('Error al registrar el cliente: ' + (err.error?.message || err.message));
        },
      });
    } else if (this.modo === 'editar' && this.idCliente) {
      this.asesorService.actualizarCliente(this.idCliente, payload).subscribe({
        next: (res) => {
          console.log('✅ Cliente actualizado con éxito:', res);
          alert('Cliente actualizado correctamente');
          this.router.navigate(['/asesor/consultar-cliente']);
        },
        error: (err) => {
          console.error('❌ Error al actualizar cliente:', err);
          alert('Error al actualizar el cliente: ' + (err.error?.message || err.message));
        },
      });
    }
  }

  obtenerDatosIniciales(nombre: string): any {
    return this.datosIniciales[nombre];
  }
}