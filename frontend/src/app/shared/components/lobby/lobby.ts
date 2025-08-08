import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketService } from '../../../core/services/socket-service';
import {NgClass} from '@angular/common';
import {Player} from '../../../core/interfaces/player';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './lobby.html',
  styleUrls: ['./lobby.css']
})
export class Lobby {
  lobbyForm: FormGroup;
  players: Player[] = [];
  role: string = '';
  currentRoomId: string = '';
  gameStarted = false;
  displayWord: any;

  constructor(private fb: FormBuilder, private socketService: SocketService) {
    this.lobbyForm = this.fb.group({
      roomID: ['', Validators.required],
      playerName: ['', Validators.required],
    });

    this.socketService.onEvent('roomCreated').subscribe((data: any) => {
      console.log("TEST")
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

      console.log("Data: ", data)

      const currentPlayer = this.lobbyForm.get('playerName')?.value;

      if (currentPlayer === data.impostor.playerName) {
        this.role = 'Impostor';
        this.displayWord = data.hint;
      } else {
        this.role = 'Crewmate';
        this.displayWord = data.word;
      }
    });

    this.socketService.onEvent('gameStopped').subscribe(() => {
      this.gameStarted = false;
      this.displayWord = '';
    });

    this.socketService.onEvent('leaveRoom').subscribe((data: any) => {
      console.log("HEY")
      this.players = data.players;
      this.currentRoomId = '';
      this.gameStarted = false;
      this.role = '';
      this.displayWord = '';
      this.lobbyForm.reset();
      this.lobbyForm.patchValue({ roomID: data.roomId });
    });
  }

  createRoom() {
    const { playerName } = this.lobbyForm.value;
    console.log("Creating room with player name:", playerName);

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

  leaveRoom() {
    const roomID = this.currentRoomId;
    const playerName = this.lobbyForm.get('playerName')?.value;

    console.log("Leaving room:", roomID, "for player:", playerName);

    this.socketService.leaveRoom(roomID, playerName);

    this.players = [];
    this.currentRoomId = '';
    this.gameStarted = false;
    this.role = '';
    this.displayWord = '';
    this.lobbyForm.reset();
  }

  debug() {
    console.log(this.players)
  }
}
