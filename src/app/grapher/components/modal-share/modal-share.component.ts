import { Component, OnInit } from '@angular/core';
import { GrapherService } from '../../services/grapher.service';
import { ClipboardService } from 'ngx-clipboard';
import { Link } from '../../interfaces/link.interface';

const ICON_CLIPBOARD = './assets/images/ic_clipboard.png';
const ICON_CHECK = './assets/images/ic_check.png';

@Component({
  selector: 'app-modal-share',
  templateUrl: './modal-share.component.html',
  styleUrls: ['./modal-share.component.css'],
})
export class ModalShareComponent implements OnInit {
  link?: Link;
  iconLink: string = ICON_CLIPBOARD;


  constructor(
    private grapherService: GrapherService,
    private clipboardService: ClipboardService,
  ) {}
  
  ngOnInit(): void {
    this.grapherService.link.subscribe((link) => {
      this.link = link;
    });
  }

  get isOpen(): boolean {
    return this.grapherService.isOpen;
  }

  closeModal(): void {
    this.grapherService.closeModal();
    this.iconLink = ICON_CLIPBOARD;
  }
  
  copyLink(): void {
    if (!this.link) return;
    this.iconLink = ICON_CHECK;
    this.clipboardService.copy(this.link.shareUrl);
  }
}
