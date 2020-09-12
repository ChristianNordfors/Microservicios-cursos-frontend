import { Component, OnInit } from '@angular/core';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Alumno } from 'src/app/models/alumno';
import { CommonListarComponent } from '../../components/common-listar.component';
import { BASE_ENDPOINT } from '../../config/app';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent
 extends CommonListarComponent<Alumno, AlumnoService> implements OnInit {

  baseEndpoint = BASE_ENDPOINT + '/alumnos';

  constructor(service: AlumnoService) {
    super(service);
    this.titulo = 'Listado de alumnos';
    this.nombreModel = Alumno.name;
   }
  
   
  
  ///////////////////////////////////////
  // HEREDA DE COMMON LISTAR COMPONENT //
  ///////////////////////////////////////

  // alumnos: Alumno[];

  // totalRegistros = 0;
  // paginaActual = 0;
  // totalPorPagina = 10;
  // pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngOnInit(): void {
  //   this.calcularRangos();
  // }

  // paginar(event: PageEvent): void{
  //   this.paginaActual = event.pageIndex;
  //   this.totalPorPagina = event.pageSize;
  //   this.calcularRangos();
  // }

  // private calcularRangos(){
    // const paginaActual = this.paginaActual+'';
    // const totalPorPagina = this.totalPorPagina+'';
  //   this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString())
  //   .subscribe(p =>{ 
  //     this.alumnos = p.content as Alumno[];
  //     this.totalRegistros = p.totalElements as number;
  //     this.paginator._intl.itemsPerPageLabel = 'Registros por página';
  //     this.paginator._intl.firstPageLabel = 'Primera página';
  //     this.paginator._intl.previousPageLabel = 'Página anterior';
  //     this.paginator._intl.nextPageLabel = 'Siguiente página';
  //     this.paginator._intl.lastPageLabel = 'Última página';
  //   });
  // }


  // public eliminar(alumno: Alumno): void{

  //   Swal.fire({
  //     title: 'Eliminar',
  //     text: "`¿Seguro desea eliminar a ${alumno.nombre} ${alumno.apellido}`",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.service.eliminar(alumno.id).subscribe(() => {
          //this.alumnos = this.alumnos.filter( a => a !== alumno);
  //         this.calcularRangos();
  //         Swal.fire('Alumno eliminado',`Alumno ${alumno.nombre} ${alumno.apellido} eliminado con éxito.`, 'success');
  //       });
  //     }
  //   })
    
  // }

}
