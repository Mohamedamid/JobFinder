import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/job.model';
import { JobCardComponent } from '../components/job-card/job-card.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';

import * as FavActions from '../../../store/favorites/favorites.actions';
import * as AppActions from '../../../store/applications/applications.actions'; 

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, JobCardComponent, SearchBarComponent, NavbarComponent],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.scss',
})
export class JobSearchComponent implements OnInit {
  private jobService = inject(JobService);
  private store = inject(Store);
  private authService = inject(AuthService);

  allJobs = signal<Job[]>([]);
  isLoading = signal(true);
  currentPage = signal(1);
  itemsPerPage = 12;
  searchCriteria = signal({ term: '', loc: '' });

  favorites$ = this.store.select((state: any) => state.favorites.items);
  favsList = toSignal(this.favorites$, { initialValue: [] });

  applications$ = this.store.select((state: any) => state.applications.items);
  appsList = toSignal(this.applications$, { initialValue: [] });

  filteredJobs = computed(() => {
    const jobs = this.allJobs();
    const criteria = this.searchCriteria();
    const term = criteria.term.toLowerCase().trim();
    const loc = criteria.loc.toLowerCase().trim();

    return jobs.filter((job) => {
      const matchTitle = job.title.toLowerCase().includes(term) || job.company_name.toLowerCase().includes(term);
      const matchLoc = job.location.toLowerCase().includes(loc);
      return matchTitle && matchLoc;
    });
  });

  displayedJobs = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredJobs().slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.filteredJobs().length / this.itemsPerPage));

  ngOnInit() {
    this.loadJobs();

    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.store.dispatch(FavActions.loadFavorites({ userId }));
      this.store.dispatch(AppActions.loadApps({ userId })); 
    } else {
      this.store.dispatch(FavActions.clearFavorites());
      this.store.dispatch(AppActions.clearApps());
    }
  }

  loadJobs() {
    this.isLoading.set(true);
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.allJobs.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onSearch(criteria: { term: string; loc: string }) {
    this.searchCriteria.set(criteria);
    this.currentPage.set(1);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}