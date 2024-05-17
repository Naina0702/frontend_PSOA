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

  Afficher_liste_membre(param:any){
    return this.http.get(`${this.uri}membres/${param}`);

  }

  Modifier_membre(data:any):Observable<any>{
    return this.http.post(`${this.uri}membres/update_membre`,data);

  }

  Delete_membre(data:any):Observable<any>{
    return this.http.post(`${this.uri}membres/delete_membre`,data);

  }


  Enregistrer_livre(data:any):Observable<any>{
    return this.http.post(`${this.uri}livre/Enregistrer_livre`,data);
  }

  Supprimer_livre(id:any):Observable<any>{
    return this.http.post(`${this.uri}livre/delete`,id);
  }

  update_livre(data:any):Observable<any>{
    return this.http.post(`${this.uri}livre/update_livre`,data);
  }

  Afficher_liste_emprunt():Observable<any>{
    return this.http.get(`${this.uri}emprunts/liste_emprunt`);

  }

  Recuper_un_membre(param:any):Observable<any>{
    return this.http.get(`${this.uri}membres/${param}`);
  }

  Nouveau_emprunts(data:any):Observable<any>{
    return this.http.post(`${this.uri}emprunts/Ajout`,data);
  }

  Delete_emprunt(data:any):Observable<any>{
    return this.http.post(`${this.uri}emprunts/delete_emprunt`,data);
  }

  Nouveau_resa(data:any):Observable<any>{
    return this.http.post(`${this.uri}Resa/Nouveau_resa`,data);   
  }

  Nouveau_resa_livre_dispo(data:any):Observable<any>{
    return this.http.post(`${this.uri}Resa/Nouveau_resa_livre_dispo`,data)
  }



  liste_reservation():Observable<any>{
    return this.http.get(`${this.uri}Resa/liste_resa`);   
  }

  retour_livre(data:any):Observable<any>{
    return this.http.post(`${this.uri}emprunts/Retour_livre`,data);   
  }


  Update_resa_id_livre_ne_change(data:any):Observable<any>{
    return this.http.post(`${this.uri}Resa/Update_resa_id_livre_non_change`,data)
  }
  
  Update_resa_id_livre_change(data:any):Observable<any>{
    return this.http.post(`${this.uri}Resa/Update_resa_id_livre_change`,data)
  }

  Update_resa_id_livre_non_dispo(data:any):Observable<any>{
    return this.http.post(`${this.uri}Resa/Update_resa_id_livre_non_dispo`,data)
  }
  
  Delete_resa_livre_non_dispo(data:any){
    return this.http.post(`${this.uri}Resa/delete_livre`,data)

  }
  Delete_resa_livre_dispo(data:any){
    return this.http.post(`${this.uri}Resa/delete_livre_dispo`,data)

  }

  Nouveau_emprunts_resa(data:any):Observable<any>{
    return this.http.post(`${this.uri}emprunts/Emprunt_resa`,data);
  }

  Nouveau_emprunts_resa_non(data:any):Observable<any>{
    return this.http.post(`${this.uri}emprunts/Emprunt_resa_dispo`,data);
  }

  Nouveau_membre(data:any):Observable<any>{
    return this.http.post(`${this.uri}membres/Ajout_membres`,data);
  }

  
  
}
