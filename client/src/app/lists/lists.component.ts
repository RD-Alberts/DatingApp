import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  members!: Partial<Member[]>;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 8;
  pagination!: Pagination;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members! = response.result;
        this.pagination! = response.pagination;
      }
    })
  }

  nextPage() {
    if (!this.pagination) return;

    if (this.pageNumber < this.pagination.totalPages) {
      ++this.pageNumber;
      this.loadLikes();
    }
  }

  prevPage() {
    if (!this.pagination) return;

    if (this.pageNumber >= this.pagination.totalPages - 1) {
      --this.pageNumber;
      this.loadLikes();
    }
  }

}
