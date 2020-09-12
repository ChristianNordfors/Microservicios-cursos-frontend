import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CursoService } from 'src/app/services/curso.service';
import { MatDialog } from '@angular/material/dialog';
import { ResponderExamenModalComponent } from './responder-examen-modal.component';
import { RespuestaService } from '../../services/respuesta.service';
import { Respuesta } from 'src/app/models/respuesta';
import Swal from 'sweetalert2';
import { VerExamenModalComponent } from './ver-examen-modal.component';

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {

  alumno: Alumno;
  curso: Curso;
  examenes: Examen[] = [];

  // @ViewChild exporta el paginator desde la vista al componente
  // Se obtiene en el componente este paginador y se pasa al datasource que a su vez es parte del datatable
  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  totalPorPagina = 10;
  pageSizeOptions = [5, 10, 25, 50];

  mostrarColumnasExamenes = ['id', 'nombre', 'asignaturas', 'preguntas', 'responder', 'ver'];

  constructor(private route: ActivatedRoute,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private respuestaService: RespuestaService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.alumnoService.ver(id).subscribe(alumno => {
        this.alumno = alumno;
        this.cursoService.obtenerCursoPorAlumnoId(this.alumno).subscribe(
          curso => {
            this.curso = curso;
            this.examenes = (curso && curso.examenes) ? curso.examenes : [];
            this.dataSource = new MatTableDataSource<Examen>(this.examenes);
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Registros por página';
          }
        );
      });
    });
  }

  responderExamen(examen: Examen): void {
    const modalRef = this.dialog.open(ResponderExamenModalComponent, {
      width: '750px',
      data: { curso: this.curso, alumno: this.alumno, examen: examen }
    });

    modalRef.afterClosed().subscribe((respuestasMap: Map<number, Respuesta>) => {
      // console.log('Modal responder examen ha sido enviado y cerrado');
      // console.log(respuestasMap);
      if (respuestasMap) {
        // Array.from() Crea una nueva instancia de array a partir de un objeto iterable
        // Array.from(respuestasMap.values()); Convierte los valores del mapa en un arreglo
        const respuestas: Respuesta[] = Array.from(respuestasMap.values());
        this.respuestaService.crear(respuestas).subscribe(rs => {
          // Al ponerse en true se deshabilita el boton y no se puede volver a responder el examen
          examen.respondido = true;
          Swal.fire('Examen respondido', 'Las respuestas fueron enviada con éxito.', 'success');
          console.log(rs);
        });
      }
    });
  }

  verExamen(examen: Examen): void {
    this.respuestaService.obtenerRespuestasPorAlumnoPorExamen(this.alumno, examen)
      .subscribe(rs => {
        const modalRef = this.dialog.open(VerExamenModalComponent, {
          width: '750px',
          data: { curso: this.curso, examen: examen, respuestas: rs }
        });

        modalRef.afterClosed().subscribe(() => {
          console.log('Modal ver examen cerrado');
          
        });
      });
  }

}
