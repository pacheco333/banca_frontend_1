// src/app/features/asesor/components/consultar-cliente/consultar-cliente.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsesorService } from '../../services/asesor.service';
import { RouterModule } from '@angular/router';

interface CuentaAhorro {
  numero_cuenta: string;
  saldo: number;
  estado_cuenta: string;
  fecha_apertura: Date;
}

@Component({
  selector: 'app-consultar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './consultar-cliente.component.html',
  styleUrls: ['./consultar-cliente.component.css'],
})
export class ConsultarClienteComponent {
  numeroDocumento: string = '';
  mensaje: string = '';
  cliente: any = null;
  cuentas: CuentaAhorro[] = []; // ← AGREGAR
  buscando: boolean = false;

  constructor(private asesorService: AsesorService) {}

  buscarCliente() {
    if (!this.numeroDocumento) {
      this.mensaje = 'Por favor ingrese un número de documento.';
      return;
    }

    this.buscando = true;
    this.mensaje = '';
    this.cliente = null;
    this.cuentas = []; // Limpiar cuentas

    this.asesorService.buscarCliente(this.numeroDocumento).subscribe({
      next: (resp) => {
        console.log('Respuesta del backend:', resp);
        this.buscando = false;
        this.mensaje = resp.mensaje;
        
        if (resp.existe) {
          this.cliente = resp.cliente;
          this.cuentas = resp.cliente.cuentas || []; // Asignar cuentas
          console.log('Cuentas encontradas:', this.cuentas);
        } else {
          this.cliente = null;
          this.cuentas = []; // ← AGREGAR
        }
      },
      error: (err) => {
        console.error('Error al buscar cliente:', err);
        this.buscando = false;
        this.mensaje = 'Error al consultar el cliente.';
        this.cuentas = []; // ← AGREGAR
      },
    });
  }

  limpiar(): void {
    this.numeroDocumento = '';
    this.mensaje = '';
    this.cliente = null;
    this.cuentas = []; // ← AGREGAR
  }

  soloNumeros(event: KeyboardEvent): void {
    const pattern = /^[0-9]$/;
    const inputChar = event.key;
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Método para formatear saldo
  formatearSaldo(saldo: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(saldo);
  }

  // Método para contar cuentas por estado
  contarCuentasPorEstado(estado: string): number {
    return this.cuentas.filter(cuenta => cuenta.estado_cuenta === estado).length;
  }
}