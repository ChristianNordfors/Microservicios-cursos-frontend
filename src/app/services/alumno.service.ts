import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alumno } from '../models/alumno';
import { CommonService } from './common.service';
import { BASE_ENDPOINT } from '../config/app';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService extends CommonService<Alumno>{

  protected baseEndpoint = BASE_ENDPOINT + '/alumnos';

  constructor(http: HttpClient) {
    super(http);
  }

  public crearConFoto(alumno: Alumno, archivo: File): Observable<Alumno> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('nombre', alumno.nombre);
    formData.append('apellido', alumno.apellido);
    formData.append('email', alumno.email);
    return this.http.post<Alumno>(this.baseEndpoint + '/crear-con-foto', formData);
  }

  public editarConFoto(alumno: Alumno, archivo: File): Observable<Alumno> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('nombre', alumno.nombre);
    formData.append('apellido', alumno.apellido);
    formData.append('email', alumno.email);
    return this.http.put<Alumno>(`${this.baseEndpoint}/editar-con-foto/${alumno.id}`, formData);
  }

  public filtrarPorNombre(nombre: string): Observable<Alumno[]>{
    return this.http.get<Alumno[]>(`${this.baseEndpoint}/filtrar/${nombre}`);
  }








  //////////////////////////////////
  // HEREDA TODO DE COMMONSERVICE //
  //////////////////////////////////







  // private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  // constructor(private http: HttpClient) { }


  // public listar(): Observable<Alumno[]> {
    // Se puede hacer de dos maneras:
    // 1.-
    // return this.http.get<Alumno[]>(this.baseEndpoint);
    // 2.-
    // return this.http.get(this.baseEndpoint).pipe(
      // A dieferencia de Java que se emite elemento por elemento, aca se emite la lista completa convertida
      // map(alumnos => alumnos as Alumno[])
    // );
  // }

  // page y size son numeros pero se envian como string porque son parametros del request
  // public listarPaginas(page: string, size: string): Observable<any>{
    // Es inmutable por lo tanto cada vez que se asigna un nuevo parametro con el set crea una nueva instancia y la orginal se pierde
    // Se invoca de forma encadenada en base a la misma instancia(const).
//     const params = new HttpParams()
//     .set('page', page)
//     .set('size', size);
//     return this.http.get<any>(`${this.baseEndpoint}/pagina`, {params: params});
//   }

//   public ver(id: number): Observable<Alumno>{
//     return this.http.get<Alumno>(`${this.baseEndpoint}/${id}`);
//   }

//   public crear(alumno: Alumno): Observable<Alumno> {
//     return this.http.post<Alumno>(this.baseEndpoint, alumno, { headers: this.cabeceras });
//   }

//   public editar(alumno: Alumno): Observable<Alumno> {
//     return this.http.put<Alumno>(`${this.baseEndpoint}/${alumno.id}`, alumno, { headers: this.cabeceras });
//   }

//   public eliminar(id: number): Observable<void>{
//     return this.http.delete<void>(`${this.baseEndpoint}/${id}`);
//   }

}
