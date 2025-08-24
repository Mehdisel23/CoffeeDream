import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-client-base',
    imports: [
        RouterOutlet
    ],
  templateUrl: './client-base.component.html',
  styleUrl: './client-base.component.scss'
})
export class ClientBaseComponent {

}
