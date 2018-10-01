import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { ImageListComponent } from './image-list/image-list.component'

const appRoutes: Routes = [
  { path: 'gallery', component: ImageListComponent },
  { path: '', redirectTo: '/gallery', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
