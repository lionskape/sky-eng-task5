import { Injectable } from '@angular/core'
import { GalleryImage } from './models/gallery-image.model'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ImageDatabaseService {

  readonly PAGE_SIZE: number = 21;
  readonly REMOTE_URL: string = 'https://jsonplaceholder.typicode.com/photos';

  constructor(private http: HttpClient) { }

  fetchAllToPage(pageNumber: number): Observable<GalleryImage[]> {
    return this.fetchImages(0, pageNumber * this.PAGE_SIZE)
  }

  fetchPage(pageNumber): Observable<GalleryImage[]> {
    return this.fetchImages((pageNumber - 1) * this.PAGE_SIZE, this.PAGE_SIZE)
  }

  private fetchImages(start: number, limit: number): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(
      this.REMOTE_URL,
      { params: new HttpParams().set('_limit', limit.toString()).set('_start', start.toString()) }
    )
  }
}
