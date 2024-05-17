import { Component } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resa',
  standalone: true,
  imports: [DatePipe,MatFormFieldModule,MatTableModule,MatInputModule],
  templateUrl: './resa.component.html',
  styleUrl: './resa.component.css',
  providers:[DatePipe]

})
export class ResaComponent {
  dataSources:any;
  constructor(private srvc: ServiceService,
    private datepipe:DatePipe) { }  
  displayedColumns: string[] = ['id_resa', 'N°Client','Nom', 'Prenoms', 'id_livre','Titre','auteur','date reservation','Action'];
  date = new Date()
  data_emprunt = new FormGroup({
    id_membres: new FormControl('', Validators.required),
    id_livre: new FormControl('', Validators.required),
    date_emprunt: new FormControl('', Validators.required),
  });

  data_resa_form = new FormGroup({
    id_resa:new FormControl('', Validators.required),
    id_membres: new FormControl('', Validators.required),
    id_livre: new FormControl('', Validators.required),
    date_reservation: new FormControl('', Validators.required),
    id_livre_data: new FormControl('', Validators.required),
    dispo_livre: new FormControl('', Validators.required)

  });

  date_emprunts = this.datepipe.transform(this.date,'yyyy-MM-dd')
  ngOnInit():void{

    this.srvc.liste_reservation().subscribe((res)=>{
      console.log(res.data)
      this.dataSources = new MatTableDataSource(res.data);
    });

  }
  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSources.filter = filterValue.trim().toLowerCase();
  }

  Emprunt_livre(data:any){
    Swal.fire({
      title: "Voulez-vous enregistré l'emprunt?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmer"
    }).then((result) => {
      if (result.isConfirmed) {
        this.data_emprunt.patchValue({
          id_membres: data.id_membres,
          id_livre: data.id_livre,
          date_emprunt: this.date_emprunts,
          });

          if(data.dispo_livre == 1){
            this.srvc.Nouveau_emprunts_resa(this.data_emprunt.value).subscribe((res)=>{
              this.srvc.Delete_resa_livre_non_dispo(data).subscribe((res)=>{
                Swal.fire({
                  title: "Enregistrement!",
                  text: "Emprunt enregistrer avec succès",
                  icon: "success"
                }); 
                 
                this.ngOnInit();
              })
            })          
          }
          else{
            this.srvc.Nouveau_emprunts_resa_non(this.data_emprunt.value).subscribe((res)=>{ 
              this.srvc.Delete_resa_livre_non_dispo(data).subscribe((res)=>{
                Swal.fire({
                  title: "Enregistrement!",
                  text: "Emprunt enregistrer avec succès",
                  icon: "success"
                }); 
                 
                this.ngOnInit();
            })   
            })
          }

/*
          this.srvc.Nouveau_emprunts(this.data_emprunt.value).subscribe((res)=>{
            Swal.fire({
              title: "Enregistrement!",
              text: "Emprunt enregistrer avec succès",
              icon: "success"
            });

            this.ngOnInit();
          })
*/
      }
    });
      
  }

  async Modifer_reservation(data:any){
    let date = this.datepipe.transform(data.date_reservation,'yyyy-MM-dd');
    const { value: formValues } = await Swal.fire({
      title: 'Modifier livre',
      html: `
      <form id="updateForm">
        <div class="form-row">
          <div class="form-group">
            <label for="titre"></label>
            <input type="text" id="id_membres" class="form-control" value="${data.id_membres}" required>
          </div>
          <div class="form-group">
            <label for="auteur"></label>
            <input type="text" id="id_livre" class="form-control" value="${data.id_livre}" required>
          </div>
          <div class="form-group">
            <label for="categorie"></label>
            <input type="date" id="date_reservation" class="form-control" value="${date}" required>
          </div>
        </div>
      </form>
      `,
      focusConfirm: false,
      confirmButtonText: "Modifier",
      confirmButtonColor: "success",
      preConfirm: () => {
        const id_membres = (document.getElementById('id_membres') as HTMLInputElement).value;
        const id_livre = (document.getElementById('id_livre') as HTMLInputElement).value;
        const date_reservation = (document.getElementById('date_reservation') as HTMLInputElement).value;

        if (!id_membres || !id_livre || !date_reservation) {
          Swal.showValidationMessage('Veuillez remplir tous les champs.');
          return null; // Ajout de cette ligne
        } else {
          return [id_livre, id_livre, date_reservation];
        }
      }
    });

    if (formValues) {
      //Swal.fire(JSON.stringify(formValues));
      const id_membres = (document.getElementById('id_membres') as HTMLInputElement).value;
      const id_livre = (document.getElementById('id_livre') as HTMLInputElement).value;
      const date_reservation = (document.getElementById('date_reservation') as HTMLInputElement).value;

      this.data_resa_form.patchValue({
        id_resa: data.id_resa,
        id_membres: id_membres,
        id_livre: id_livre,
        date_reservation: date_reservation,
        id_livre_data:data.id_livre
        
      });
  

    console.log(this.data_resa_form.value);
      if(id_livre == data.id_livre){
        this.data_resa_form.patchValue({
          id_resa: data.id_resa,
          id_membres: id_membres,
          id_livre: id_livre,
          date_reservation: date_reservation,
          id_livre_data:data.id_livre,
          dispo_livre:data.dispo_livre
        
        });
    
        this.srvc.Update_resa_id_livre_ne_change(this.data_resa_form.value).subscribe((res)=>{
          this.ngOnInit();
          Swal.fire({
            title: "Modification!",
            text: "Réservation modifiée avec succès",
            icon: "success"
          });
        });
  
  
      }
      else{

        
        this.srvc.Afficher_Liste_livre(id_livre).subscribe((res:any)=>{
          if(res.message == "ok"){
            if(res.data[0].exemplaire==0){
              this.srvc.Update_resa_id_livre_non_dispo(this.data_resa_form.value).subscribe((res)=>{
                this.ngOnInit();
                Swal.fire({
                  title: "Modification!",
                  text: "Réservation modifiée avec succès",
                  icon: "success"
                });
              });
            }
            else{ 
              
                this.srvc.Update_resa_id_livre_change(this.data_resa_form.value).subscribe((res)=>{
                  this.ngOnInit();
                  Swal.fire({
                    title: "Modification!",
                    text: "Réservation modifiée avec succès",
                    icon: "success"
                  });
                });
            
             
              console.log(data.dispo_livre);
            }
          }

        });
      }
          
  }    
    }

    Supprimer_un_livre(data:any){
      Swal.fire({
        title: `Voulez-vous supprimé la réservation No.${data.id_resa} de ${data.nom}`,
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: "Oui",
        denyButtonText: `Non`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
  
          if(data.dispo_livre==0){
            this.srvc.Delete_resa_livre_non_dispo(data).subscribe((res)=>{
              Swal.fire({
                title: "Suppression!",
                text: "Réservation suprimé avec succès",
                icon: "success"
              });
              this.ngOnInit();
            })
          }else{
            this.srvc.Delete_resa_livre_dispo(data).subscribe((res)=>{
              Swal.fire({
                title: "Suppression!",
                text: "Réservation suprimé avec succès",
                icon: "success"
              });
              this.ngOnInit();
            })
          }
  
        } else if (result.isDenied) {
          Swal.fire("Suppressionn annulé", "", "info");
        }
      });
    }
  }

