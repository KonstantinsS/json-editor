import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonEditorComponent, JsonEditorOptions, NgJsonEditorModule } from 'ang-jsoneditor';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { DownloadService } from '../../services/download.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, ListboxModule, NgJsonEditorModule, FormsModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
  editorOptions: JsonEditorOptions;
  fileData: Observable<any>;
  files: Observable<string[]>;
  activeUsers: Observable<string[]>;
  selectedFile = null;

  constructor(private apiService: ApiService, private downloadService: DownloadService, private wsService: WebsocketService) {}

  ngOnInit(): void {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.expandAll = true;
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.files = this.apiService.getAllFiles();
    this.wsService.connect();
    this.fileData = this.wsService.fileData;
    this.activeUsers = this.wsService.activeUsers;
  }

  fileSelectionChanged(fileName: string): void {
    if (this.selectedFile) {
      this.wsService.disconnect(this.selectedFile);
    }
    this.wsService.subscribeToUpdates(fileName);
    this.selectedFile = fileName;
  }

  updateFile(e: any): void {
    this.wsService.updateFile(this.selectedFile, e);
  }

  downloadFile(): void {
    this.downloadService.downloadAsJson(this.editor.get(), this.selectedFile);
  }

  ngOnDestroy(): void {
    this.wsService.disconnect(this.selectedFile);
  }
}
