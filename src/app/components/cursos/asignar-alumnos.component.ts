import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Alumno } from 'src/app/models/alumno';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css']
})
export class AsignarAlumnosComponent implements OnInit {

  
  curso: Curso;
  alumnos: Alumno[] = [];
  alumnosAsignar: Alumno[] = [];

  dataSource: MatTableDataSource<Alumno>;
  // static: true  para que este disponible el cambio del paginator en el oninit
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  totalPorPagina = 50
  pageSizeOptions: number[] = [5, 10, 25, 50];

  mostrarColumnas: string[] = ['nombre', 'apellido', 'seleccion'];
  mostrarColumnasAlumnos: string[] = ['id', 'nombre', 'apellido', 'email', 'eliminar'];
  tabIndex = 0;

  // true para indicar seleccion multiple y [] para inicializar el arreglo vacio para guardar los objetos alumnos seleccionados
  seleccion: SelectionModel<Alumno> = new SelectionModel<Alumno>(true, []);
  
  constructor(private route: ActivatedRoute,
      private cursoService: CursoService,
      private alumnoService: AlumnoService) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {
        this.curso = c;
        this.alumnos = this.curso.alumnos;
        this.alumnos = this.curso.alumnos;
        this.iniciarPaginador();
      });
    });
  }


  iniciarPaginador(): void {
    this.dataSource = new MatTableDataSource<Alumno>(this.alumnos);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Registros por página';
  }
  
  

  filtrar(nombre: string): void {
    nombre = nombre !== undefined? nombre.trim(): '';
    if(nombre !== ''){
      this.alumnoService.filtrarPorNombre(nombre)
      .subscribe(alumnos => this.alumnosAsignar = alumnos.filter(a => {
        // .filter retorna un boolean y si es true cada elemento emitida se asigna. Filtrar va a ser false por cada alumno que ya este dentro del curso
        // Para el resto va a ser true con return filtrar;
        let filtrar = true;
        this.alumnos.forEach(ca => {
          if(a.id === ca.id){
            filtrar = false;
          }
        });
        return filtrar;
      }));
    } 
    // else {
    //   this.alumnosAsignar = [];
    // }
  }

  estanTodosSeleccionados(): boolean {
    const seleccionados = this.seleccion.selected.length;
    const numAlumnos = this.alumnosAsignar.length;
    return (seleccionados === numAlumnos);
  }

  seleccionarDeseleccionarTodos(): void {
    this.estanTodosSeleccionados()?
    this.seleccion.clear():
    this.alumnosAsignar.forEach(a => this.seleccion.select(a));

  }

  // selected retorna un arreglo con los alumnos seleccionados
  asignar(): void {
    console.log(this.seleccion.selected);
    this.cursoService.asignarAlumnos(this.curso, this.seleccion.selected)
    .subscribe(c => {
      this.tabIndex = 2;
      // Swal.fire('Alumnos asignados', `Los alumnos se asignaron al curso con éxito ${this.curso.nombre}`, 'success');
      
      // Para actualizar el tab con los alumnos del curso con concat
      this.alumnos = this.alumnos.concat(this.seleccion.selected);
      this.iniciarPaginador();
      this.alumnosAsignar = [];
      this.seleccion.clear();
      
    },
    e => {
      if(e.status === 500) {
        const mensaje = e.error.message as string;
        if(mensaje.indexOf('ConstraintViolationException') > -1) {
          Swal.fire('Cuidado', 'El alumno ya se encuentra asociado a otro curso.', 'warning');
        }
      }
    }
    );
  }

  eliminarAlumno(alumno: Alumno): void {
    Swal.fire({
      title: 'Eliminar',
      text: `¿Seguro desea eliminar a ${alumno.nombre} ${alumno.apellido? alumno.apellido : ''}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
    }).then((result) => {
      if (result.value) {
        this.cursoService.eliminarAlumno(this.curso, alumno)
        // Se pasa el curso con el id y el alumno a eliminar del curso, el backend lo desasigna el curso y retorna el curso actualizado, aca se emite y se maneja la respuesta
        .subscribe(curso => {
          this.alumnos = this.alumnos.filter(a => a.id !== alumno.id);
          this.iniciarPaginador();
          Swal.fire('Alumno removido', `El alumno ${alumno.nombre} ${alumno.apellido} fue desasignado del curso ${curso.nombre}`, 'success');
        });
      }
    });
  }

}
