import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { GoogleImage } from '~shared/models/google-image';
import { ImageService } from '~shared/services/image.service';

@Component({
  standalone: true,
  imports: [NgIf, NgForOf, MatDialogModule, MatButtonModule, MatInputModule, LoaderComponent],
  selector: 'col-images-finder-dialog',
  templateUrl: './images-finder-dialog.component.html',
  styleUrls: ['./images-finder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageFinderDialogComponent implements OnInit {
  searchTerm: string[];
  images: GoogleImage[] = [];
  loading = true;
  loadingMore = false;

  selected: GoogleImage | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) searchTerm: string[],
    private imageService: ImageService,
    private cd: ChangeDetectorRef
  ) {
    this.searchTerm = searchTerm;
  }

  ngOnInit(): void {
    this.loading = true;
    this.imageService.findGoogleImages(this.searchTerm).subscribe((result) => {
      this.images = result;
      this.loading = false;
      this.cd.markForCheck();
    });
  }

  getMore(): void {
    this.loadingMore = true;
    this.imageService.findGoogleImages(this.searchTerm, this.images.length + 1).subscribe((result) => {
      this.loadingMore = false;
      this.images = [...this.images, ...result];
      this.cd.markForCheck();
    });
  }

  selectImage(image: GoogleImage): void {
    this.selected = image;
    this.cd.markForCheck();
  }
}
