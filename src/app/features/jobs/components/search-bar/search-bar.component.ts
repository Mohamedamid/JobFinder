import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  keyword = '';
  location = '';

  @Output() searchEvent = new EventEmitter<{ term: string, loc: string }>();

  triggerSearch() {
    this.searchEvent.emit({ 
      term: this.keyword, 
      loc: this.location 
    });
  }

  reset() {
    this.keyword = '';
    this.location = '';
    this.triggerSearch();
  }
}