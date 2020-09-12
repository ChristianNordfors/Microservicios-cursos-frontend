import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { ExamenService } from 'src/app/services/examen.service';
import { FormControl } from '@angular/forms';
import { Examen } from 'src/app/models/examen';
import { map, flatMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.css']
})
export class AsignarExamenesComponent implements OnInit {

  curso: Curso;

  // Evento como keyup pero del controlador de formulario
  autocompleteControl: FormControl = new FormControl();

  examenesFiltrados: Examen[] = [];

  examenesAsignar: Examen[] = [];

  examenes: Examen[] = [];
  dataSource: MatTableDataSource<Examen>;

  // Exporta de la plantilla -???-
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator ;
  totalPorPagina = 10;
  pageSizeOptions = [5, 10, 25, 50];

  mostrarColumnas: string[] = ['nombre', 'asignatura', 'eliminar'];
  mostrarColumnasExamenes = ['id','nombre','asignaturas', 'eliminar'];
  tabIndex = 0;
  

  constructor(private route: ActivatedRoute,
              private router: Router,
              private cursoService: CursoService,
              private examenService: ExamenService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {
        this.curso = c
        this.examenes = this.curso.examenes;  // Tambien podria ser c.examenes

        this.iniciarPaginador();
        
      });
    });

    this.autocompleteControl.valueChanges.pipe(
      // Se convierte el valor de lo buscado a string para ir a buscarlo por el 'termino' al backend
      map(valor => typeof valor === 'string'? valor: valor.nombre),
      // Con flatMap se modifica el stream del valueChanges que es del tipo Observable<any>. Se 'aplana' a otro tipo de Observable, en este caso a Examen
      flatMap(valor => valor? this.examenService.filtrarPorNombre(valor): [])
    ).subscribe(examenes => this.examenesFiltrados = examenes);

  }


  private iniciarPaginador(){
    this.dataSource = new MatTableDataSource<Examen>(this.examenes);
    this.dataSource.paginator = this.paginador;
    this.paginador._intl.itemsPerPageLabel = 'Registros por página';
  }
  
  

  mostrarNombre(examen? : Examen): string {
    return examen? examen.nombre : '';
  }



  seleccionarExamen(event: MatAutocompleteSelectedEvent): void {
    const examen = event.option.value as Examen;
    // Para que se actualice el datatable y detecte los cambios hay que crear un arreglo nuevo y asignarselo al del datasource
    // Con concat se retorna un nuevo arreglo con los datos existentes mas el que se agrego por ultimo
    // Como es inmutable crea un nuevo arreglo con el cambio. Puede recibir un elemento o un arreglo
    if(!this.existe(examen.id)){
      this.examenesAsignar = this.examenesAsignar.concat(examen);
  
      console.log(this.examenesAsignar);
      
    } else {
      Swal.fire('Cuidado',`El examen ${examen.nombre} ya está asignado al curso.`,'warning');
    }
    this.autocompleteControl.setValue('');
      event.option.deselect();
      event.option.focus();
  }

  private existe(id: number): boolean {
    let existe = false;
    this.examenesAsignar.concat(this.examenes)
    .forEach(e => {
      if(id === e.id) {
        existe = true;
      }
    });
    return existe;
  }

  eliminarDelAsignar(examen: Examen): void {
    this.examenesAsignar = this.examenesAsignar.filter(
      e => examen.id !== e.id
    );
  }

  asignar(): void {
    console.log(this.examenesAsignar);

    this.cursoService.asignarExamenes(this.curso, this.examenesAsignar)
    .subscribe(curso => {
      this.examenes = this.examenes.concat(this.examenesAsignar);

      this.iniciarPaginador();
      
      this.examenesAsignar = [];

      Swal.fire('Examen asignado', `Examen asignado con éxito al curso ${curso.nombre}.`, 'success');

      this.tabIndex = 1;
    });
  }

  eliminarExamenDelCurso(examen: Examen): void {
      Swal.fire({
        title: 'Eliminar',
        text: `¿Seguro desea eliminar el examen ${examen.nombre}}?`,
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
          this.cursoService.eliminarExamen(this.curso, examen)
          // Se pasa el curso con el id y el alumno a eliminar del curso, el backend lo desasigna el curso y retorna el curso actualizado, aca se emite y se maneja la respuesta
          .subscribe(curso => {
            this.examenes = this.examenes.filter(e => e.id !== examen.id);
            this.iniciarPaginador();
            Swal.fire('Examen removido', `El examen ${examen.nombre} fue desasignado del curso ${curso.nombre}`, 'success');
          });
        }
      });
    }
  

}
