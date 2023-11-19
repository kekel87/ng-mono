import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Storage, StorageReference, UploadResult } from '@angular/fire/storage';
import * as fireStorage from '@angular/fire/storage';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { first } from 'rxjs/operators';

import { RUNTIME_CONFIG } from '~shared/consts/runtime-config';
import * as MockImage from '~tests/mocks/images';
import { MockRuntimeConfig } from '~tests/mocks/runtime-config';

import { ImageService } from './image.service';

jest.mock('@angular/fire/storage');

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;
  const document = { createElement: jest.fn(), querySelectorAll: () => [] };
  const storage = jest.fn();

  // https://newdevzone.com/posts/how-to-test-imgonload-using-jest
  let onloadRef: () => void | undefined;
  let onerrorRef: () => void | undefined;

  beforeAll(() => {
    Object.defineProperty(Image.prototype, 'onload', {
      get() {
        return this._onload;
      },
      set(onload: () => void) {
        onloadRef = onload;
        this._onload = onload;
      },
    });
    Object.defineProperty(Image.prototype, 'onerror', {
      get() {
        return this._onerror;
      },
      set(onerror: () => void) {
        onerrorRef = onerror;
        this._onerror = onerror;
      },
    });
  });

  beforeEach(async () => {
    await MockBuilder(ImageService)
      .keep(HttpClientTestingModule)
      .provide({ provide: Storage, useValue: storage })
      .provide({ provide: DOCUMENT, useValue: document })
      .provide({ provide: RUNTIME_CONFIG, useValue: MockRuntimeConfig.base });

    service = ngMocks.findInstance(ImageService);
    httpMock = ngMocks.findInstance(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should find an image', () => {
    service.getImage('toto').subscribe((images) => {
      expect(images).toEqual(expect.any(Blob));
    });

    const req = httpMock.expectOne({ method: 'GET' });
    req.flush(new Blob());
    httpMock.verify();
  });

  describe('resize and upload', () => {
    const canvas = {
      getContext: jest.fn(),
      remove: jest.fn(),
      toBlob: jest.fn(),
    };
    const context = {
      drawImage: jest.fn(),
      canvas,
    };

    beforeEach(() => {
      const storageReference = {} as StorageReference;
      const uploadResult = {} as UploadResult;
      jest.spyOn(fireStorage, 'ref').mockReturnValue(storageReference);
      jest.spyOn(fireStorage, 'uploadBytes').mockReturnValue(Promise.resolve(uploadResult));
      jest.spyOn(fireStorage, 'getDownloadURL').mockReturnValue(Promise.resolve('firebase-url'));

      document.createElement.mockReturnValue(canvas);
      canvas.getContext.mockReturnValue(context);
      canvas.toBlob.mockImplementation((callback) => callback(new Blob()));
    });

    it('should not resize small image', (done) => {
      service
        .upload('path', 'img/50.png')
        .pipe(first())
        .subscribe({
          next: (newUrl) => {
            expect(newUrl).toEqual('firebase-url');
            done();
          },
          error: done.fail,
        });

      onloadRef();
    });

    it('should resize to height image', (done) => {
      service
        .upload('path', 'img/50x250.png')
        .pipe(first())
        .subscribe({
          next: (newUrl) => {
            expect(newUrl).toEqual('firebase-url');
            expect(document.createElement).toHaveBeenCalledWith('canvas');
            expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png', 0.8);
            done();
          },
          error: done.fail,
        });

      onloadRef();
    });

    it('should resize to width image', (done) => {
      service
        .upload('path', 'img/500x50.png')
        .pipe(first())
        .subscribe({
          next: (newUrl) => {
            expect(newUrl).toEqual('firebase-url');
            expect(document.createElement).toHaveBeenCalledWith('canvas');
            expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png', 0.8);
            done();
          },
          error: done.fail,
        });

      onloadRef();
    });

    it('should resize jpg image', (done) => {
      service
        .upload('path', 'img/500x50.jpg')
        .pipe(first())
        .subscribe({
          next: (newUrl) => {
            expect(newUrl).toEqual('firebase-url');
            expect(document.createElement).toHaveBeenCalledWith('canvas');
            expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.8);
            done();
          },
          error: done.fail,
        });

      onloadRef();
    });

    it('should resize base 64 image gif', (done) => {
      service
        .upload('path', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        .pipe(first())
        .subscribe({
          next: (newUrl) => {
            expect(newUrl).toEqual('firebase-url');
            expect(document.createElement).toHaveBeenCalledWith('canvas');
            expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/gif', 0.8);
            done();
          },
          error: done.fail,
        });

      onloadRef();
    });

    it('should handle wrong url', (done) => {
      service
        .upload('path', '404.png')
        .pipe(first())
        .subscribe({
          next: () => done.fail(),
          error: () => done(),
        });

      onerrorRef();
    });

    it('should handle canvas context missing', (done) => {
      canvas.getContext.mockReturnValue(null);

      service
        .upload('path', 'img/500x50.png')
        .pipe(first())
        .subscribe({
          next: () => done.fail(),
          error: () => done(),
        });

      onloadRef();
    });

    it('should handle canvas toBlob failure', (done) => {
      canvas.toBlob.mockImplementation((callback) => callback(null));

      service
        .upload('path', 'img/500x50.png')
        .pipe(first())
        .subscribe({
          next: () => done.fail(),
          error: () => done(),
        });

      onloadRef();
    });
  });

  it('should find search google image', () => {
    service.findGoogleImages(['Search', 'term', 'toto tata']).subscribe((images) => {
      expect(images).toEqual(MockImage.images);
    });

    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.params.get('q')).toEqual('search+term+toto+tata');
    expect(req.request.params.get('searchType')).toEqual('image');
    expect(req.request.params.get('start')).toEqual('1');
    expect(req.request.params.get('cx')).toEqual(MockRuntimeConfig.base.googleSearch.cseId);
    expect(req.request.params.get('key')).toEqual(MockRuntimeConfig.base.googleSearch.apiKey);
    req.flush(MockImage.imagesReponse);
    httpMock.verify();
  });

  it('should find search google image with paginate', () => {
    service.findGoogleImages(['toto'], 11).subscribe((images) => {
      expect(images).toEqual(MockImage.images);
    });

    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.params.get('q')).toEqual('toto');
    expect(req.request.params.get('searchType')).toEqual('image');
    expect(req.request.params.get('start')).toEqual('11');
    expect(req.request.params.get('cx')).toEqual(MockRuntimeConfig.base.googleSearch.cseId);
    expect(req.request.params.get('key')).toEqual(MockRuntimeConfig.base.googleSearch.apiKey);
    req.flush(MockImage.imagesReponse);
    httpMock.verify();
  });
});
