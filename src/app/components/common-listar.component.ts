import { OnInit, ViewChild, Directive } from '@angular/core';
// import { AlumnoService } from 'src/app/services/alumno.service';
// import { Alumno } from 'src/app/models/alumno';
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

import Swal from 'sweetalert2';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

@Directive()
export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  titulo: string;
  lista: E[];
  protected nombreModel: string;

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(protected service: S) { }

  ngOnInit(): void {
    this.calcularRangos();
  }

  paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }

  private calcularRangos() {
    // const paginaActual = this.paginaActual+'';
    // const totalPorPagina = this.totalPorPagina+'';
    this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString())
      .subscribe(p => {
        this.lista = p.content as E[];
        this.totalRegistros = p.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = 'Registros por página';
        this.paginator._intl.firstPageLabel = 'Primera página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Siguiente página';
        this.paginator._intl.lastPageLabel = 'Última página';
      });
  }


  public eliminar(e: E): void {

    Swal.fire({
      title: 'Eliminar',
      text: `¿Seguro desea eliminar a ${e.nombre} ${e.apellido? e.apellido : ''}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      // hideClass: {
      //   popup: 'animate__animated animate__fadeOut animate__faster'
      // }
    }).then((result) => {
      if (result.value) {
        this.service.eliminar(e.id).subscribe(() => {
          //this.alumnos = this.alumnos.filter( a => a !== alumno);
          this.calcularRangos();
          Swal.fire('Eliminar', `${this.nombreModel} ${e.nombre} ${e.apellido? e.apellido : ''} eliminado con éxito.`, 'success');
        });
      }
    });

  }

}
