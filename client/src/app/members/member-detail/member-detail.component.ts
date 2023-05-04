import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  tab1: boolean | undefined;
  tab2: boolean | undefined;
  tab3: boolean | undefined;

  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMemeber();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
  }

  getImages() {
    if(!this.member) return [];
    const imageUrls = [];
    for(const photo of this.member.photos) {
      imageUrls.push ({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }

    return imageUrls;
  }

  loadMemeber() {
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        this.galleryImages = this.getImages();
      }
    });
  }
  showTab(tab: string) {
    switch (tab) {
      case 'tab1':
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        break;
      case 'tab2':
        this.tab2 = true;
        this.tab1 = false;
        this.tab3 = false;
        break;
      case 'tab3':
        this.tab3 = true;
        this.tab1 = false;
        this.tab2 = false;
        break;
      default:
        break;
    }
  }
}

