import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Task } from '../../types/task';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<void>();
  private dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private taskService = inject(TaskService);
  isLoading = false;
  isLoadingDelete = false;

  formatDate(): string {
    const date = new Date(this.task.created_at);
    return date.toLocaleDateString();
  }

  updateTask() {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: {
        mode: 'update',
        task: this.task,
      },
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      const { error, message } = result;
      if (!error) {
        this._snackBar.open('Task updated', '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-info'],
        });
        this.taskUpdated.emit();
      } else {
        this._snackBar.open(
          'There was an error while trying to update a new task',
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

  setTaskAsCompleted(event: MatSlideToggleChange) {
    const newState = event.checked;
    this.isLoading = true;
    this.taskService
      .updateTaskCompletedField(newState, this.task.id)
      .subscribe({
        next: () => {
          this._snackBar.open('Task updated', '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-info'],
          });
          this.taskUpdated.emit();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this._snackBar.open(
            'There was an error while trying to update a new task',
            '',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-error'],
            }
          );
        },
      });
  }

  deleteTask() {
    this.isLoadingDelete = true;
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this._snackBar.open('Task deleted', '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-info'],
        });
        this.taskUpdated.emit();
        this.isLoadingDelete = false;
      },
      error: () => {
        this.isLoadingDelete = false;
        this._snackBar.open(
          'There was an error while trying to delete a new task',
          '',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error'],
          }
        );
      },
    });
  }
}
