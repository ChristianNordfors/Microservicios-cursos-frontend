import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Generic } from '../models/generic';
// import { map } from 'rxjs/operators';
// import { Alumno } from '../models/alumno';


export abstract class CommonService<E extends Generic> {

  protected baseEndpoint: string;

  protected cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(protected http: HttpClient) { }


  public listar(): Observable<E[]> {
    // Se puede hacer de dos maneras:
    // 1.-
    return this.http.get<E[]>(this.baseEndpoint);
    // 2.-
    // return this.http.get(this.baseEndpoint).pipe(
      // A dieferencia de Java que se emite elemento por elemento, aca se emite la lista completa convertida
      // map(alumnos => alumnos as Alumno[])
    // );
  }

  // page y size son numeros pero se envian como string porque son parametros del request
  public listarPaginas(page: string, size: string): Observable<any>{
    // Es inmutable por lo tanto cada vez que se asigna un nuevo parametro con el set crea una nueva instancia y la orginal se pierde
    // Se invoca de forma encadenada en base a la misma instancia(const).
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/pagina`, {params: params});
  }

  public ver(id: number): Observable<E>{
    return this.http.get<E>(`${this.baseEndpoint}/${id}`);
  }

  public crear(e: E): Observable<E> {
    return this.http.post<E>(this.baseEndpoint, e, { headers: this.cabeceras });
  }

  public editar(e: E): Observable<E> {
    return this.http.put<E>(`${this.baseEndpoint}/${e.id}`, e, { headers: this.cabeceras });
  }

  public eliminar(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseEndpoint}/${id}`);
  }

}
