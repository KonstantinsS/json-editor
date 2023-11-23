import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from "socket.io-client";
import { wsUrl } from '../../environments/environments';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket: Socket;
  userName = this.userService.user.value;
  fileData = new BehaviorSubject(null);
  activeUsers = new BehaviorSubject([]);

  constructor(private userService: UserService) {}

  connect(): void {
    this.socket = io(wsUrl, {
      auth: {userName: this.userName}
    })
    this.socket.on('connect', () => {
      this.socket.on('users', (users: string[]) => this.activeUsers.next(users.filter(user => user !== this.userName)))
      this.socket.on('fileData', data => this.fileData.next(data))
    });
  }

  subscribeToUpdates(fileName: string): void {
    this.socket.emit('subscribeToUpdates', {fileName, userName: this.userName})
  }

  updateFile(fileName: string, data: object): void {
    this.socket.emit('updateFile', {fileName, data: JSON.stringify(data)});
  }

  disconnect(fileName: string): void {
    this.socket.emit('unsubscribeFromUpdates', {fileName, userName: this.userName})
  }
}
