import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Lobby } from './shared/components/lobby/lobby';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Lobby],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
