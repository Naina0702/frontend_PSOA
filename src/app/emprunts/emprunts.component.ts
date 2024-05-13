import { Component } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';


@Component({
  selector: 'app-emprunts',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './emprunts.component.html',
  styleUrl: './emprunts.component.css'
})
export class EmpruntsComponent {
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
