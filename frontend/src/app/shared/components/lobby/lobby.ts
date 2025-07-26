import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketService } from '../../../core/services/socket-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './lobby.html',
  styleUrls: ['./lobby.css']
})
export class Lobby {
  lobbyForm: FormGroup;
  players: string[] = [];
  gameStarted = false;
  displayWord = '';

  constructor(private fb: FormBuilder, private socketService: SocketService) {
    this.lobbyForm = this.fb.group({
      roomID: ['', Validators.required],
      playerName: ['', Validators.required],
    });

    this.socketService.onEvent('playerList').subscribe((data: string[]) => {
      this.players = data;
    });

    this.socketService.onEvent('gameStarted').subscribe((data: any) => {
      this.gameStarted = true;
      const currentPlayer = this.lobbyForm.get('playerName')?.value;
      this.displayWord = currentPlayer === data.impostor ? '???' : data.word;
    });
  }

  createRoom() {
    const { roomID, word } = this.lobbyForm.value;

    this.socketService.createRoom(roomID, word);

    this.socketService.joinRoom(roomID, this.lobbyForm.get('playerName')?.value);
  }

  joinRoom() {
    const { roomID, playerName } = this.lobbyForm.value;
    this.socketService.joinRoom(roomID, playerName);
  }

  startGame() {
    const roomID = this.lobbyForm.get('roomID')?.value;
    this.socketService.startGame(roomID);
  }
}
