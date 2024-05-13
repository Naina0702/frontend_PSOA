import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiceService } from '../service/service.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css'
})
export class ListeComponent {

  constructor(private srvc: ServiceService) { }
  data_livre: any
  data_livre_2:any
  data_categorie: any;

  data_livre_add = new FormGroup({
    titre:new FormControl('',Validators.required),
    auteur:new FormControl('',Validators.required),
    categorie:new FormControl('',Validators.required),
    exemplaire:new FormControl('',Validators.required),
    pochette:new FormControl('',Validators.required),

  })

  data_livre_modif = new FormGroup({
    id_livre:new FormControl('',Validators.required),
    titre:new FormControl('',Validators.required),
    auteur:new FormControl('',Validators.required),
    categorie:new FormControl('',Validators.required),
    exemplaire:new FormControl('',Validators.required),
    pochette:new FormControl('',Validators.required),

  })
  
    ngOnInit() {

      this.srvc.Afficher_Liste_livre("liste").subscribe((res: any) => {
        console.log(res.data)
        this.data_livre = res.data
      });
  
      this.srvc.Afficher_Liste_livre("categorie").subscribe((res: any) => {
        console.log(res.data)
        this.data_categorie = res.data
      });

    }

  async Nouveau_livre() {
    const { value: formValues } = await Swal.fire({
      title: 'Nouveau livre',
      html: `
      <form>
      <div class="form-row">
        <div class="form-group">
          <label for="inputEmail4"></label>
          <input type="text" id="titre" required="required" class="form-control" id="inputEmail4" placeholder="Titre">
        </div>
        <div class="form-group">
          <label for="inputPassword4"></label>
          <input type="text" id="auteur" required="required" class="form-control" id="inputPassword4" placeholder="Auteur">
        </div>
        <div class="form-group">
          <label for="inputPassword4"></label>
          <input type="text" id="categorie" required="required" class="form-control" id="inputPassword4" placeholder="Categorie">
        </div>
        <div class="form-group">
          <label for="inputPassword4"></label>
          <input type="number" id="exemplaire" required="required" class="form-control" id="inputPassword4" placeholder="Exemplaire">
        </div>
        <div class="form-group">
          <label for="inputPassword4"></label>
          <input type="text" id="pochette" required="required" class="form-control" id="inputPassword4" placeholder="Pochette">
        </div>
      </div>
    </form>
      `,
      focusConfirm: false,
      confirmButtonText:"Enregistrer",
      confirmButtonColor:"success",
      preConfirm: () => {
        const titre = (document.getElementById('titre') as HTMLInputElement).value;
        const auteur = (document.getElementById('auteur') as HTMLInputElement).value;
        const categorie = (document.getElementById('categorie') as HTMLInputElement).value;
        const exemplaire = (document.getElementById('exemplaire') as HTMLInputElement).value;
        const pochette = (document.getElementById('pochette') as HTMLInputElement).value;

        if (!titre || !auteur || !categorie || !exemplaire || !pochette) {
          Swal.showValidationMessage('Veuillez remplir tous les champs.');
          return null; // Ajout de cette ligne
        } else {
          return [titre, auteur, categorie, exemplaire,pochette];
        }
      }
    });

    if (formValues) {
      //Swal.fire(JSON.stringify(formValues));
      this.data_livre_add.patchValue({
        titre:formValues[0],
        auteur:formValues[1],
        categorie:formValues[2],
        exemplaire:formValues[3],
        pochette:formValues[4]
      })
      Swal.fire({
        title: "Voulez vous enregistrer le livre ?",
        text: `Titre : ${formValues[0]} - Auteur: ${formValues[1]} - Catégorie:${formValues[2]} - Exemplaire:${formValues[3]}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continuer"
      }).then((result) => {
        if (result.isConfirmed) {
          this.srvc.Enregistrer_livre(this.data_livre_add.value).subscribe((res:any)=>{
            console.log(res)
          this.ngOnInit();
          Swal.fire({
            title: "Enregistrement!",
            text: "Livre ajouté avec succès",
            icon: "success"
          });

          })

          console.log(this.data_livre_add.value)
        }
      });
    }
  }

  async Update_livre(data:any){
    this.srvc.Afficher_Liste_livre(data.id_livre).subscribe(async (res:any)=>{
       this.data_livre_2= res.data;

      this.data_livre_modif.patchValue({
        id_livre:res.data[0].id_livre,
        titre:res.data[0].titre,
        auteur:res.data[0].auteur,
        categorie:res.data[0].categorie,
        exemplaire:res.data[0].exemplaire,
        pochette:res.data[0].pochette      
      })

      const { value: formValues } = await Swal.fire({
        title: 'Modifier livre',
        html: `
        <form id="updateForm">
          <div class="form-row">
            <div class="form-group">
              <label for="titre"></label>
              <input type="text" id="titre" class="form-control" value="${res.data[0].titre}" required>
            </div>
            <div class="form-group">
              <label for="auteur"></label>
              <input type="text" id="auteur" class="form-control" value="${res.data[0].auteur}" required>
            </div>
            <div class="form-group">
              <label for="categorie"></label>
              <input type="text" id="categorie" class="form-control" value="${res.data[0].categorie}" required>
            </div>
            <div class="form-group">
              <label for="exemplaire"></label>
              <input type="number" id="exemplaire" class="form-control" value="${res.data[0].exemplaire}" required>
            </div>
            <div class="form-group">
              <label for="pochette"></label>
              <input type="text" id="pochette" class="form-control" value="${res.data[0].pochette}" required>
            </div>
          </div>
        </form>
        `,
        focusConfirm: false,
        confirmButtonText:"Modifier",
        confirmButtonColor:"success",
        preConfirm: () => {
          const titre = (document.getElementById('titre') as HTMLInputElement).value;
          const auteur = (document.getElementById('auteur') as HTMLInputElement).value;
          const categorie = (document.getElementById('categorie') as HTMLInputElement).value;
          const exemplaire = (document.getElementById('exemplaire') as HTMLInputElement).value;
          const pochette = (document.getElementById('pochette') as HTMLInputElement).value;
  
          if (!titre || !auteur || !categorie || !exemplaire || !pochette) {
            Swal.showValidationMessage('Veuillez remplir tous les champs.');
            return null; // Ajout de cette ligne
          } else {
            return [titre, auteur, categorie, exemplaire,pochette];
          }
        }
      });
  
      if (formValues) {
        //Swal.fire(JSON.stringify(formValues));
        this.data_livre_add.patchValue({
          titre:formValues[0],
          auteur:formValues[1],
          categorie:formValues[2],
          exemplaire:formValues[3],
          pochette:formValues[4]
        })
        Swal.fire({
          title: "Voulez vous enregistrer le livre ?",
          text: `Titre : ${formValues[0]} - Auteur: ${formValues[1]} - Catégorie:${formValues[2]} - Exemplaire:${formValues[3]}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Continuer"
        }).then((result) => {
          if (result.isConfirmed) {
            this.srvc.Enregistrer_livre(this.data_livre_add.value).subscribe((res:any)=>{
              console.log(res)
            this.ngOnInit();
            Swal.fire({
              title: "Enregistrement!",
              text: "Livre ajouté avec succès",
              icon: "success"
            });
  
            })
  
            console.log(this.data_livre_add.value)
          }
        });
      }
  

    });

  }

  Delete_livre(data:any){

    Swal.fire({
      title: `Voulez-vous supprimé le livre ${data.titre}`,
      icon:"warning",
      showDenyButton: true,
      confirmButtonText: "Oui",
      denyButtonText: `Non`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.srvc.Supprimer_livre(data.id_livre).subscribe((res)=>{
          Swal.fire(`livre supprimer avec succès!`, "", "success");
          this.ngOnInit();
        })

      } else if (result.isDenied) {
        Swal.fire("Suppressionn annulé", "", "info");
      }
    });
  }
}
