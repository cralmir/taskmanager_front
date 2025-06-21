import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);
  data = inject(MAT_DIALOG_DATA);

  taskForm!: FormGroup;
  isUpdate = false;

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.min(1)]],
      description: [''],
    });

    if (this.data?.mode === 'update' && this.data.task) {
      this.isUpdate = true;
      this.taskForm.patchValue(this.data.task);
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      if (!this.isUpdate) {
        const { title, description } = this.taskForm.value;
        this.taskService.addNewTask(title || '', description || '').subscribe({
          next: (task) => this.dialogRef.close({ mode: 'add', error: false }),
          error: (err) =>
            this.dialogRef.close({ mode: 'add', error: true, message: err }),
        });
      } else {
        const { title, description } = this.taskForm.value;
        this.taskService
          .updateTask(title || '', description || '', this.data.task?.id)
          .subscribe({
            next: (task) =>
              this.dialogRef.close({ mode: 'update', error: false }),
            error: (err) =>
              this.dialogRef.close({
                mode: 'update',
                error: true,
                message: err,
              }),
          });
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
