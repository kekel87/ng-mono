import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import { GoogleImage, GoogleImageSearchResponse } from '~shared/models/google-image';
import { RuntimeConfig } from '~shared/models/runtime-config';

import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  readonly url: string;
  readonly id: string;
  readonly apiKey: string;
  readonly corsAnywhere: string;

  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(RUNTIME_CONFIG) { corsAnywhere, googleSearch }: RuntimeConfig
  ) {
    this.url = googleSearch.url;
    this.id = googleSearch.cseId;
    this.apiKey = googleSearch.apiKey;
    this.corsAnywhere = corsAnywhere;
  }

  getImage(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  upload(path: string, url: string): Observable<string> {
    return this.resize(url).pipe(
      switchMap((image: Blob) =>
        this.supabaseService.upload(path, image, {
          cacheControl: '7200',
          upsert: true,
        })
      )
    );
  }

  findGoogleImages(query: string[], start = 1): Observable<GoogleImage[]> {
    return this.http
      .get<GoogleImageSearchResponse>(this.url, {
        params: {
          q: query.join(' ').toLowerCase().replace(/\s/g, '+'),
          searchType: 'image',
          cx: this.id,
          key: this.apiKey,
          start: `${start}`,
        },
      })
      .pipe(map(mapToGoogleImage));
  }

  private resize(url: string, width = 400, height = 200, quality = 0.8): Observable<Blob> {
    return new Observable((observer) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.src = isBase64(url) ? url : `${this.corsAnywhere}/${url}`;

      image.onload = () => {
        const canvas = this.document.createElement('canvas');

        if (image.width >= image.height && image.width > width) {
          canvas.height = Math.round(image.height * (width / image.width));
          canvas.width = width;
        } else if (image.width < image.height && image.height > height) {
          canvas.width = Math.round(image.width * (height / image.height));
          canvas.height = height;
        } else {
          canvas.width = image.width;
          canvas.height = image.height;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          ctx.canvas.toBlob(
            (blob) => {
              canvas.remove();
              if (blob) {
                observer.next(blob);
              } else {
                observer.error('Canvas to blob conversion failure');
              }
              observer.complete();
            },
            getImageType(url),
            quality
          );
        } else {
          observer.error('Canvas context not created');
        }
      };

      image.onerror = (error) => {
        observer.error(error);
      };
    });
  }
}

function mapToGoogleImage(raw: GoogleImageSearchResponse): GoogleImage[] {
  return raw.items.map((item) => ({
    type: item.mime,
    width: item.image.width,
    height: item.image.height,
    size: item.image.byteSize,
    url: item.link,
    thumbnail: {
      url: item.image.thumbnailLink,
      width: item.image.thumbnailWidth,
      height: item.image.thumbnailHeight,
    },
  }));
}

function getImageType(url: string): string {
  if (url.includes('png')) {
    return 'image/png';
  }

  if (url.includes('image/gif')) {
    return 'image/gif';
  }

  return 'image/jpeg';
}

function isBase64(url: string): boolean {
  return url.includes('base64');
}
