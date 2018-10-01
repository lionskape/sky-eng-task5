import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageDetailComponent } from './image-detail/image-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { ImageDatabaseService } from './image-database.service'
import { HttpClientModule } from '@angular/common/http';
import { GalleryHeaderComponent } from './gallery-header/gallery-header.component'
import { ModalModule } from './modal/modal.module'

@NgModule({
  declarations: [
    AppComponent,
    ImageListComponent,
    GalleryHeaderComponent,
    ImageDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot({container: 'modal-container'})
  ],
  providers: [ImageDatabaseService],
  bootstrap: [AppComponent],
  entryComponents: [
    ImageDetailComponent
  ]
})
export class AppModule { }
