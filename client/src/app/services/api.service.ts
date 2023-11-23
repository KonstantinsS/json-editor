import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverUrl } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAllFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${serverUrl}files`)
  }
}
