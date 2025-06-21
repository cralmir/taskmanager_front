import { Component, HostListener, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../types/task';
import { AuthService } from '../../services/auth.service';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    TaskItemComponent,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  taskList: Task[] = [];
  cols = 4;

  ngOnInit() {
    this.loadTasks();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateGridCols(event.target.innerWidth);
  }

  updateGridCols(width: number) {
    if (width < 600) {
      this.cols = 1;
    } else if (width < 960) {
      this.cols = 3;
    } else {
      this.cols = 4;
    }
  }

  logout() {
    this.authService.logout();
  }

  addNewTask() {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: {
        mode: 'add',
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      const { error, message } = result;
      if (!error) {
        this._snackBar.open('Task created', '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-info'],
        });
        this.loadTasks();
      } else {
        this._snackBar.open(
          'There was an error while trying to create a new task',
          message,
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error'],
          }
        );
      }
    });
  }

  loadTasks() {
    this.taskService.getTasksByUser().subscribe({
      next: (response: any) => (this.taskList = response?.tasks),
      error: (err) => console.error('Error loading tasks', err),
    });
  }
}
