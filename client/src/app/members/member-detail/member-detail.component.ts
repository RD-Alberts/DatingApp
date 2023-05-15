import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('messageForm') messageForm!: NgForm;
  member!: Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  tab1!: boolean;
  tab2!: boolean;
  tab3!: boolean;
  tab4!: boolean;
  messages: Message[] = [];
  messageContent!: string;
  user!: User;

  constructor(
    public presenceService: PresenceService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user;
      },
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
    this.galleryImages = this.getImages();
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = false;

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] ? this.showTab('tab' + params['tab']) : this.showTab('tab1')
      }
    })
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

  loadMessages(){
    this.messageService.getMessageThread(this.member.username).subscribe({
      next: messages => {
        this.messages = messages;
        if(messages.length === 0) this.toastr.warning("You haven't started a chat yet", "No contact");
      }
    });
  }

  sendMessage() {
    this.messageService
      .sendMessage(this.member.username, this.messageContent)
      .then(() => {
        this.messageForm.reset();
      });
  }

  showTab(tab: string) {
    switch (tab) {
      case 'tab1':
        this.messageService.stopHubConnection();
        this.tab1 = true;
        this.tab2 = false;
        this.tab3 = false;
        this.tab4 = false;
        break;
      case 'tab2':
        this.messageService.stopHubConnection();
        this.tab2 = true;
        this.tab1 = false;
        this.tab3 = false;
        this.tab4 = false;
        break;
      case 'tab3':
        this.messageService.stopHubConnection();
        this.tab3 = true;
        this.tab1 = false;
        this.tab2 = false;
        this.tab4 = false;
        break;
      case 'tab4':
        if (this.messages.length == 0) {
          this.loadMessages();
          this.messageService.createHubConnection(
            this.user,
            this.member.username
          );
          this.tab4 = true;
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = false;
          break;
        } else {
          this.loadMessages();
          this.messageService.createHubConnection(
            this.user,
            this.member.username
          );
          this.tab4 = true;
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = false;
          break;
        }
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}