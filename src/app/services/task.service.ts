import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Task } from '../types/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly base_url =
    'http://127.0.0.1:5001/taskmanager-1d0a1/us-central1/api';

  getTasksByUser() {
    return this.http.get<Task[]>(`${this.base_url}/task`);
  }

  addNewTask(title: string, description: string | null) {
    return this.http.post<Task>(`${this.base_url}/task`, {
      title,
      description,
    });
  }

  updateTask(title: string, description: string | null, taskId: string) {
    return this.http.patch<Task>(`${this.base_url}/task/${taskId}`, {
      title,
      description,
    });
  }

  updateTaskCompletedField(completed: boolean, taskId: string) {
    return this.http.patch<Task>(`${this.base_url}/task/${taskId}`, {
      completed,
    });
  }

  deleteTask(taskId: string) {
    return this.http.delete<boolean>(`${this.base_url}/task/${taskId}`);
  }
}
