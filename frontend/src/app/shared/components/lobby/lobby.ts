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
  currentRoomId: string = '';
  gameStarted = false;
  displayWord: any;

  constructor(private fb: FormBuilder, private socketService: SocketService) {
    this.lobbyForm = this.fb.group({
      roomID: ['', Validators.required],
      playerName: ['', Validators.required],
    });

    this.socketService.onEvent('roomCreated').subscribe((data: any) => {
      this.currentRoomId = data.roomId;
      this.players = data.players;
      this.displayWord = data.word;
      this.lobbyForm.patchValue({ roomID: data.roomId });
    });

    this.socketService.onEvent('roomUpdate').subscribe((data: any) => {
      this.players = data.players;
    });

    this.socketService.onEvent('gameStarted').subscribe((data: any) => {
      this.gameStarted = true;
      const currentPlayer = this.lobbyForm.get('playerName')?.value;
      this.displayWord = currentPlayer === data.impostor ? data.hint : data.word;
    });

    this.socketService.onEvent('gameStopped').subscribe(() => {
      this.gameStarted = false;
      this.displayWord = '';
    });
  }

  createRoom() {
    const { playerName } = this.lobbyForm.value;
    this.socketService.createRoom(playerName);
  }

  joinRoom() {
    const { roomID, playerName } = this.lobbyForm.value;
    this.currentRoomId = roomID;
    this.socketService.joinRoom(roomID, playerName);
  }

  startGame() {
    const roomID = this.currentRoomId;
    this.socketService.startGame(roomID);
  }

  stopGame() {
    const roomID = this.currentRoomId;
    this.socketService.stopGame(roomID);
    this.gameStarted = false;
  }
}
