import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
