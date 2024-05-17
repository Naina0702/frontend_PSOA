import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [DatePipe,MatFormFieldModule,MatTableModule,MatInputModule],
  templateUrl: './membres.component.html',
  styleUrl: './membres.component.css',
  providers:[DatePipe]

})
export class MembresComponent {
  dataSources:any;

  constructor(private srvc: ServiceService) { }
  displayedColumns: string[] = ['id_membres','Nom', 'Prenoms', 'email','adresse','telephone','Action'];
  data_membre = new FormGroup({
    id_membres:new FormControl('', Validators.required),
    nom:new FormControl('', Validators.required),
    prenoms: new FormControl('', Validators.required),
    adresse: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required),
  })
  ngOnInit():void{

    this.srvc.Afficher_liste_membre("liste").subscribe((res:any)=>{
      console.log(res.data)
      this.dataSources = new MatTableDataSource(res.data);
    });

  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSources.filter = filterValue.trim().toLowerCase();
  }

  async Nouveau_membre() {
    const { value: formValues } = await Swal.fire({
      title: 'Nouveau membre',
      html: `
      <form>
      <div class="form-row">
        <div class="form-group">
          <label for="inputEmail4"></label>
          <input type="text" id="nom" required="required" class="form-control" id="inputEmail4" placeholder="Nom">
        </div>
        <div class="form-group">
          <label for="inputPassword4"></label>
          <input type="text" id="prenoms" required="required" class="form-control" id="inputPassword4" placeholder="Prénoms">
        </div>
        <div class="form-group">
          <label for="inputPassword4"></label>
          <input type="text" id="email" required="required" class="form-control" id="inputPassword4" placeholder="email">
        </div>
        <div class="form-group">
          <label for="inputPassword4"></label>
          <input type="text" id="adresse" required="required" class="form-control" id="inputPassword4" placeholder="adresse">
        </div>
        <div class="form-group">
          <label for="inputPassword4"></label>
          <input type="text" id="telephone" required="required" class="form-control" id="inputPassword4" placeholder="telephone">
        </div>
      </div>
    </form>
      `,
      focusConfirm: false,
      confirmButtonText: "Enregistrer",
      confirmButtonColor: "success",
      preConfirm: () => {
        const nom = (document.getElementById('nom') as HTMLInputElement).value;
        const prenoms = (document.getElementById('prenoms') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const adresse = (document.getElementById('adresse') as HTMLInputElement).value;
        const telephone = (document.getElementById('telephone') as HTMLInputElement).value;

        if (!nom || !prenoms || !email || !adresse || !telephone) {
          Swal.showValidationMessage('Veuillez remplir tous les champs.');
          return null; // Ajout de cette ligne
        } else {
          return [nom, prenoms, email, adresse, telephone];
        }
      }
    });

    if (formValues) {
      //Swal.fire(JSON.stringify(formValues));
      this.data_membre.patchValue({
        nom:formValues[0],
        prenoms: formValues[1],
        email: formValues[2],
        adresse: formValues[3],
        telephone: formValues[4]
      })
      Swal.fire({
        title: "Voulez vous enregistrer le membre ?",
        text: `Nom : ${formValues[0]} - Prénoms: ${formValues[1]} - email:${formValues[2]} - adresse:${formValues[3]} - telephone:${formValues[4]}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continuer"
      }).then((result) => {
        if (result.isConfirmed) {
         this.srvc.Nouveau_membre(this.data_membre.value).subscribe((res)=>{
          this.ngOnInit();
          Swal.fire({
            title: "Modification!",
            text: "Membre ajouté avec succès",
            icon: "success"
          });

         });
        }
      });
    }
  }

  Modifier_membres(data:any){
    this.srvc.Afficher_liste_membre(data.id_membres).subscribe(async (res:any)=>{
      const { value: formValues } = await Swal.fire({
        title: 'Modifier membre',
        html: `
        <form>
        <div class="form-row">
          <div class="form-group">
            <label for="inputEmail4"></label>
            <input type="text" id="nom" value="${res.data[0].nom}" required="required" class="form-control" id="inputEmail4" placeholder="Nom">
          </div>
          <div class="form-group">
            <label for="inputPassword4"></label>
            <input type="text" id="prenoms" value="${res.data[0].prenoms}" required="required" class="form-control" id="inputPassword4" placeholder="Prénoms">
          </div>
          <div class="form-group">
            <label for="inputPassword4"></label>
            <input type="text" id="email" value="${res.data[0].email}" required="required" class="form-control" id="inputPassword4" placeholder="email">
          </div>
          <div class="form-group">
            <label for="inputPassword4"></label>
            <input type="text" id="adresse" value="${res.data[0].adresse}" required="required" class="form-control" id="inputPassword4" placeholder="adresse">
          </div>
          <div class="form-group">
            <label for="inputPassword4"></label>
            <input type="text" id="telephone" value="${res.data[0].telephone}" required="required" class="form-control" id="inputPassword4" placeholder="telephone">
          </div>
        </div>
      </form>
        `,
        focusConfirm: false,
        confirmButtonText: "Modifier",
        confirmButtonColor: "success",
        preConfirm: () => {
          const nom = (document.getElementById('nom') as HTMLInputElement).value;
          const prenoms = (document.getElementById('prenoms') as HTMLInputElement).value;
          const email = (document.getElementById('email') as HTMLInputElement).value;
          const adresse = (document.getElementById('adresse') as HTMLInputElement).value;
          const telephone = (document.getElementById('telephone') as HTMLInputElement).value;
  
          if (!nom || !prenoms || !email || !adresse || !telephone) {
            Swal.showValidationMessage('Veuillez remplir tous les champs.');
            return null; // Ajout de cette ligne
          } else {
            return [nom, prenoms, email, adresse, telephone];
          }
        }
      });
  

      if (formValues) {
        //Swal.fire(JSON.stringify(formValues));
        this.data_membre.patchValue({
          id_membres:data.id_membres,
          nom:formValues[0],
          prenoms: formValues[1],
          email: formValues[2],
          adresse: formValues[3],
          telephone: formValues[4]
        })
        Swal.fire({
          title: "Voulez vous modifier le membre ?",
          text: `Nom : ${formValues[0]} - Prénoms: ${formValues[1]} - email:${formValues[2]} - adresse:${formValues[3]} - telephone:${formValues[4]}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Continuer"
        }).then((result) => {
          if (result.isConfirmed) {
           this.srvc.Modifier_membre(this.data_membre.value).subscribe((res)=>{
            this.ngOnInit();
            Swal.fire({
              title: "Enregistrement!",
              text: "Membre ajouté avec succès",
              icon: "success"
            });
  
           });
          }
        });
      }    
    });
  }

  Supprimer_membre(data:any){
      Swal.fire({
        title: `Voulez-vous supprimé le membre No.${data.id_membres} - ${data.nom}`,
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: "Oui",
        denyButtonText: `Non`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
              this.srvc.Delete_membre(data).subscribe((res)=>{
              Swal.fire({
                title: "Suppression!",
                text: "Membre suprimé avec succès",
                icon: "success"
              });
              this.ngOnInit();
            })    
        } else if (result.isDenied) {
          Swal.fire("Suppressionn annulé", "", "info");
        }
      });
  }
}
