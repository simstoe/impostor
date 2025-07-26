import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  createRoom(roomId: string, word: string) {
    this.socket.emit('createRoom', { roomId, word });
  }

  joinRoom(roomId: string, player: string) {
    this.socket.emit('joinRoom', { roomId, player });
  }

  startGame(roomId: string) {
    this.socket.emit('startGame', roomId);
  }

  onEvent(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }
}
