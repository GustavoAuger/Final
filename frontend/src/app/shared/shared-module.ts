
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@NgModule({
  imports: [
    CommonModule,
    // Se importan los componentes standalone (que no son módulos)
    Header,
    Footer
  ],
  exports: [
    // Exporta los componentes para usarlos en otros módulos
    Header,
    Footer
  ]
})
export class SharedModule {}