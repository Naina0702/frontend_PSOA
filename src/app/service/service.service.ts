import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  uri = `http://localhost:8290/`;

  constructor(private http:HttpClient) { }

  Afficher_Liste_livre(param:any){
    return this.http.get(`${this.uri}livre/${param}`);
  }

  Enregistrer_livre(data:any):Observable<any>{
    return this.http.post(`${this.uri}livre/Enregistrer_livre`,data);
  }

  Supprimer_livre(id:any):Observable<any>{

    
    return this.http.delete(`${this.uri}livre/Delete_livre/${id}`);
  }


}
