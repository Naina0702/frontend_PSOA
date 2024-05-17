import { Component } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServiceService } from '../service/service.service';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emprunts',
  standalone: true,
  imports: [DatePipe,MatFormFieldModule,MatTableModule,MatInputModule],
  templateUrl: './emprunts.component.html',
  styleUrl: './emprunts.component.css',
  providers:[DatePipe]

})
export class EmpruntsComponent {
  dataSources:any;
  constructor(private srvc: ServiceService,
    private datepipe:DatePipe) { }
  displayedColumns: string[] = ['N°Emprunts', 'N°Client','Nom', 'Prenoms', 'id_livre','Titre','auteur','date_em','date_re','Action'];
  data_retours = new FormGroup({
    id_emprunts:new FormControl('',Validators.required),
    id_membres: new FormControl('', Validators.required),
    id_livre: new FormControl('', Validators.required),
    date_retour: new FormControl('', Validators.required),
    date_emprunt: new FormControl('', Validators.required)

  });
  ngOnInit():void{

    this.srvc.Afficher_liste_emprunt().subscribe((res)=>{
      console.log(res.data)
      this.dataSources = new MatTableDataSource(res.data);
    })
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSources.filter = filterValue.trim().toLowerCase();
  }

  Delete_emprunt(data:any){
    this.srvc.Delete_emprunt(data).subscribe((res)=>{
      
    });
  }

  async Date_retours(data:any){
    const { value: dates } = await Swal.fire({
      title: "Retour livre",
      input: "date",
      didOpen: () => {
        const today = (new Date()).toISOString();
        //Swal.getInput().min = today.split("T")[0];
      }
    });
    if (dates) {
      const d_r = this.datepipe.transform(dates,'yyyy-MM-dd');
      const d_e= this.datepipe.transform(data.date_emprunt,'yyyy-MM-dd');
      this.data_retours.patchValue({
        id_emprunts:data.id_emprunts,
        id_membres: data.id_membres,
        id_livre: data.id_livre,
        date_retour:d_r,
        date_emprunt:d_e

      });
      console.log(this.data_retours.value);
      this.srvc.retour_livre(this.data_retours.value).subscribe((res)=>{
        Swal.fire({
          title: "Retour livre!",
          text: "Retour du livre enregistré avec succès!",
          icon: "success"
        });
      })
    }
  }
}
