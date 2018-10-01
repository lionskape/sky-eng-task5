import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component'
import { GalleryImage } from '../models/gallery-image.model'

export interface Interface {

}

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent extends ModalComponent<{}, GalleryImage> {

  constructor() {
    super();
  }

  ngOnInit() {
    console.dir(this);
  }

}
