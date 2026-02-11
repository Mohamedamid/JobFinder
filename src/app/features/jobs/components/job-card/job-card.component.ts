import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../../core/models/job.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss'
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
}