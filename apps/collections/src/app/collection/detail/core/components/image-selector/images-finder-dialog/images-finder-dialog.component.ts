import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { GoogleImage } from '~shared/models/google-image';
import { ImageService } from '~shared/services/image.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, LoaderComponent],
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
