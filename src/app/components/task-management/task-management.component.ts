import { Component } from '@angular/core';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css']
})
export class TaskManagementComponent {
  tasks: { title: string; description: string; dueDate: Date }[] = [];

  // Method to convert string to Date
  private convertToDate(dateString: string): Date {
    return new Date(dateString);
  }

  addTask(title: string, description: string, dueDate: string) {
    this.tasks.push({ title, description, dueDate: this.convertToDate(dueDate) });
  }

  editTask(index: number, title: string, description: string, dueDate: string) {
    this.tasks[index] = { title, description, dueDate: this.convertToDate(dueDate) };
  }
  
  
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }
  
}
