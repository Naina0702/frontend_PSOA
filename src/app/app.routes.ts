import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component"
import { EmpruntsComponent } from './emprunts/emprunts.component';
import { ListeComponent } from './liste/liste.component';
import { ResaComponent } from './resa/resa.component';
import { MembresComponent } from './membres/membres.component';


export const routes: Routes = [
    {path:'',component:DashboardComponent},
    {path:'Emprunts',component:EmpruntsComponent},
    {path:'Liste',component:ListeComponent},
    {path:'Reservation',component:ResaComponent},
    {path:'membres',component:MembresComponent}

];
