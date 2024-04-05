import { Component } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { ClipboardService } from 'ngx-clipboard';

const ICON_CLIPBOARD = './assets/images/ic_clipboard.png';
const ICON_CHECK = './assets/images/ic_check.png';

@Component({
  selector: 'app-modal-share',
  templateUrl: './modal-share.component.html',
  styleUrls: ['./modal-share.component.css'],
})
export class ModalShareComponent {
  link: string = '';
  iconLink: string = ICON_CLIPBOARD;


  constructor(
    private shareService: ShareService,
    private clipboardService: ClipboardService,
  ) {}

  get isOpen(): boolean {
    return this.shareService.isOpen;
  }

  closeModal(): void {
    this.shareService.closeModal();
    this.iconLink = ICON_CLIPBOARD;
  }
  
  copyLink(): void {
    // if (!this.link) return;
    this.iconLink = ICON_CHECK;
    // this._clipboardService.copy(this.link.shareUrl);
  }
}
