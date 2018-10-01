import { Component, OnInit } from '@angular/core'
import { ImageDatabaseService } from '../image-database.service'
import { Observable, Subscriber, of } from 'rxjs'
import { GalleryImage } from '../models/gallery-image.model'
import { ActivatedRoute } from '@angular/router'
import { ModalService } from '../modal/modal.service'
import { ImageDetailComponent } from '../image-detail/image-detail.component'

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css'],
})
export class ImageListComponent implements OnInit {

  imageList: GalleryImage[] = [];
  isNotCompleted: boolean = true;

  private currentPage: number = 1;
  private imageSubscriber: Subscriber<GalleryImage[]>
  private imageObserver$: Observable<GalleryImage[]>

  constructor(
    private imageDatabase: ImageDatabaseService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    if (typeof this.activatedRoute.snapshot.queryParams.page !== 'undefined') {
      this.currentPage = parseInt(this.activatedRoute.snapshot.queryParams.page);
    }

    this.imageObserver$ = Observable.create(observer => {
      this.imageSubscriber = observer;
    }).subscribe({
      next: nextPage => this.imageList = this.imageList.concat(nextPage),
      complete: () => this.complete(),
    });

    this.imageDatabase.fetchAllToPage(this.currentPage).subscribe(data => this.imageSubscriber.next(data));
  }

  loadMore() {
    this.currentPage += 1;

    this.imageDatabase.fetchPage(this.currentPage)
      .subscribe(data => data.length === 0 ? this.imageSubscriber.complete() : this.imageSubscriber.next(data))
  }

  showDetail(imageModel: GalleryImage) {
    this.modalService.addModal(ImageDetailComponent, imageModel);
  }

  private complete () {
    this.isNotCompleted = !this.isNotCompleted;
  }
}
