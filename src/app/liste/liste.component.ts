import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiceService } from '../service/service.service';
import { NgFor,NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,NgFor,DatePipe],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css',
  providers:[DatePipe]
})
export class ListeComponent {

  constructor(private srvc: ServiceService,
    private datepipe:DatePipe) { }
  data_livre: any
  data_livre_2: any
  data_categorie: any
  date = new Date()
  date_emprunts = this.datepipe.transform(this.date,'yyyy-MM-dd')
  data_livre_add = new FormGroup({
    titre: new FormControl('', Validators.required),
    auteur: new FormControl('', Validators.required),
    categorie: new FormControl('', Validators.required),
    exemplaire: new FormControl('', Validators.required),
    pochette: new FormControl('', Validators.required),
  });
  data_resa_form = new FormGroup({
    id_membres: new FormControl('', Validators.required),
    id_livre: new FormControl('', Validators.required),
    date_reservation: new FormControl('', Validators.required)
  });

  data_emprunt = new FormGroup({
    id_membres: new FormControl('', Validators.required),
    id_livre: new FormControl('', Validators.required),
    date_emprunt: new FormControl('', Validators.required),
  });

  data_livre_modif = new FormGroup({
    id_livre: new FormControl('', Validators.required),
    titre: new FormControl('', Validators.required),
    auteur: new FormControl('', Validators.required),
    categorie: new FormControl('', Validators.required),
    exemplaire: new FormControl('', Validators.required),
    pochette: new FormControl('', Validators.required),

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
          <input type="text" id="pochette" required="required" class="form-control" id="inputPassword4" placeholder="URL Pochette">
        </div>
      </div>
    </form>
      `,
      focusConfirm: false,
      confirmButtonText: "Enregistrer",
      confirmButtonColor: "success",
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
          return [titre, auteur, categorie, exemplaire, pochette];
        }
      }
    });

    if (formValues) {
      //Swal.fire(JSON.stringify(formValues));
      this.data_livre_add.patchValue({
        titre: formValues[0],
        auteur: formValues[1],
        categorie: formValues[2],
        exemplaire: formValues[3],
        pochette: formValues[4]
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
          this.srvc.Enregistrer_livre(this.data_livre_add.value).subscribe((res: any) => {
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

  async Update_livre(data: any) {
    this.srvc.Afficher_Liste_livre(data.id_livre).subscribe(async (res: any) => {

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
              <input type="text" id="pochette" class="form-control" value="${res.data[0].pochette}" placeholder='url pochette' required>
            </div>
          </div>
        </form>
        `,
        focusConfirm: false,
        confirmButtonText: "Modifier",
        confirmButtonColor: "success",
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
            return [titre, auteur, categorie, exemplaire, pochette];
          }
        }
      });

      if (formValues) {
        //Swal.fire(JSON.stringify(formValues));
        this.data_livre_modif.patchValue({
          id_livre: res.data[0].id_livre,
          titre: formValues[0],
          auteur: formValues[1],
          categorie: formValues[2],
          exemplaire: formValues[3],
          pochette: formValues[4]
        })
        Swal.fire({
          title: "Voulez-vous modifier le livre ?",
          text: `Titre : ${formValues[0]} - Auteur: ${formValues[1]} - Catégorie:${formValues[2]} - Exemplaire:${formValues[3]}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Continuer"
        }).then((result) => {
          if (result.isConfirmed) {
            this.srvc.update_livre(this.data_livre_modif.value).subscribe((res: any) => {
              console.log(res)
              this.ngOnInit();
              Swal.fire({
                title: "Modification!",
                text: "Livre modifié avec succès",
                icon: "success"
              });

            })

            console.log(this.data_livre_modif.value)
          }
        });
      }


    });

  }

  Delete_livre(data: any) {

    Swal.fire({
      title: `Voulez-vous supprimé le livre ${data.titre}`,
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Oui",
      denyButtonText: `Non`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.srvc.Supprimer_livre(data).subscribe((res) => {
          Swal.fire(`livre supprimer avec succès!`, "", "success");
          this.ngOnInit();
        })

      } else if (result.isDenied) {
        Swal.fire("Suppressionn annulé", "", "info");
      }
    });
  }
  async Reserver_(data:any){
    const { value: id_membre } = await Swal.fire({
      title: "Nouveau Réservation",
      input: "text",
      inputLabel: "Veuillez saisir l'ID du demandeur",
      inputPlaceholder: "ID membre",
      customClass:{

      }
    });
    if (id_membre) {
      this.srvc.Recuper_un_membre(id_membre).subscribe((res)=>{
        if(res.message=='ok'){
          this.data_resa_form.patchValue({
            id_membres: id_membre,
            id_livre: data.id_livre,
            date_reservation: this.date_emprunts
          });

          this.srvc.Nouveau_resa_livre_dispo(this.data_resa_form.value).subscribe((res)=>{
            Swal.fire({
              title: "Réservation!",
              text: "Réservation pris en charge!",
              icon: "success"
            });
            this.ngOnInit();
          });
        }
        else{
          this.nouveau_membres(id_membre);
        }
      })
    }
  }
  async Reserver(data:any){
    const { value: id_membre } = await Swal.fire({
      title: "Nouveau Réservation",
      input: "text",
      inputLabel: "Veuillez saisir l'ID du demandeur",
      inputPlaceholder: "ID membre",
      customClass:{

      }
    });
    if (id_membre) {
      this.srvc.Recuper_un_membre(id_membre).subscribe((res)=>{
        if(res.message=='ok'){
          this.data_resa_form.patchValue({
            id_membres: id_membre,
            id_livre: data.id_livre,
            date_reservation: this.date_emprunts
          });

          this.srvc.Nouveau_resa(this.data_resa_form.value).subscribe((res)=>{
            Swal.fire({
              title: "Réservation!",
              text: "Réservation pris en charge!",
              icon: "success"
            });
          });
        }
        else{
          this.nouveau_membres(id_membre);
        }
      })
    }
  }

  async nouveau_emprunt(data: any) {
    if(data.exemplaire==0){
      Swal.fire({
        text:"Le livre '"+data.titre+"' n'est pas disponible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Reserver"
      }).then(async (result) => {
        if (result.isConfirmed) {

          this.Reserver(data);
        }
      });
    }
    else{
      const { value: id_membre } = await Swal.fire({
        title: "Nouveau Empruts",
        input: "text",
        inputLabel: "Veuillez saisir l'ID du demandeur",
        inputPlaceholder: "ID membre",
        customClass:{
  
        }
      });
      if (id_membre) {
        this.srvc.Recuper_un_membre(id_membre).subscribe((res)=>{
          if(res.message=='ok'){
            Swal.fire({
              title: "Nouveau Emprunt",
              html:`    
  
              <div class="card">
              <div class="card-body">
                <h5 class="card-title border-bottom">Information du membre</h5>
                <div class="row">
                  <div class="col-4 text-start fs-6">ID Membre : </div>
                  <div class="col-8 text-start fs-6">${res.data[0].id_membres}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-start fs-6">Nom : </div>
                  <div class="col-8 text-start fs-6">${res.data[0].nom}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-start fs-6">Prénom(s) : </div>
                  <div class="col-8 text-start fs-6">${res.data[0].prenoms}</div>
                </div>
                <br>
                <h5 class="card-title border-bottom">Information du livre</h5>
                <div class="row mb-2">
                  <div class="col-md-12">
                      <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                          <div class="col p-4 d-flex flex-column position-static">
                              <strong class="d-inline-block mb-2 text-start text-success-emphasis border-bottom">${data.categorie}</strong>
                              <h3 class="mb-0 text-start">${data.titre}</h3>
                              <div class="mb-1 text-start text-body-secondary">${data.auteur}</div>
                              <h3 class="mb-0 text-start"> Date emprunt : </h3>
                              <h3 class="mb-0 text-start border-bottom">${this.date_emprunts}</h3>
                              </div>
                          <div class="col-auto d-none d-lg-block">
              
                              <img src="../../assets/Animal_Farm_-_1st_edition.jpg" alt="" srcset="" width="200" height="250">
                          </div>
                      </div>
                  </div>
              </div>
              </div>
          </div>`,
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Confirmer"
            }).then((result) => {
  
              this.data_emprunt.patchValue({
                id_membres: res.data[0].id_membres,
                id_livre: data.id_livre,
                date_emprunt: this.date_emprunts,
                })
              if (result.isConfirmed) {
                this.srvc.Nouveau_emprunts(this.data_emprunt.value).subscribe((res)=>{
                  Swal.fire({
                    title: "Enregistrement!",
                    text: "Emprunt enregistrer avec succès",
                    icon: "success"
                  });
  
                  this.ngOnInit();
                })
  
                console.log(this.data_emprunt.value)
              }
            });
          }
          else{
            this.nouveau_membres(id_membre);
          }
        })
      }
    }
  }

  nouveau_membres(id_membre:any){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger m-1"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      text: id_membre+" ne figure pas dans la base",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Créer",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }



}
