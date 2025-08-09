import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {Observable} from 'rxjs';
import {Player} from '../interfaces/player';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly socketURL = environment.socketURL;

  constructor() {
    if (environment.production) {
      this.socket = io({
        path: this.socketURL,
        transports: ['websocket'],
        withCredentials: false
      });
    } else {
      this.socket = io(this.socketURL, {
        transports: ['websocket'],
        withCredentials: false
      });
    }



    console.log("Die SocketURL: ", this.socketURL);

    this.socket.on('connect', () => console.log('Socket connected'));
    this.socket.on('disconnect', () => console.log('Socket disconnected'));
    this.socket.on('connect_error', (err) => console.error('Connection error', err));
  }

  createRoom(playerName: string) {
    this.socket.emit('createRoom', playerName);
  }

  joinRoom(roomId: string, player: string) {
    this.socket.emit('joinRoom', { roomId, player });
  }

  startGame(roomId: string) {
    this.socket.emit('startGame', roomId);
  }

  stopGame(roomId: string) {
    this.socket.emit('stopGame', roomId);
  }

  leaveRoom(roomId: string, player: string) {
    console.log("Leaving room:", roomId, "for player:", player);
    this.socket.emit('leaveRoom', { roomId, player });
  }

  kickPlayer(roomId: string, player: string) {
    console.log("Kicking player:", player);
  }

  onEvent(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }
}
