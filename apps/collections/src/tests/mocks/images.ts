import { GoogleImage, GoogleImageSearchResponse } from '~shared/models/google-image';

export const imagesReponse: GoogleImageSearchResponse = {
  kind: 'customsearch#search',
  url: {
    type: 'application/json',
    template: '',
  },
  items: [
    {
      kind: 'customsearch#result',
      title: '',
      htmlTitle: '',
      link: 'assets/400x200.png',
      displayLink: 'www.youtube.com',
      snippet: '',
      htmlSnippet: '',
      mime: 'image/jpeg',
      image: {
        contextLink: '',
        height: 100,
        width: 100,
        byteSize: 100,
        thumbnailLink: 'assets/400x200.png',
        thumbnailHeight: 100,
        thumbnailWidth: 100,
      },
    },
    {
      kind: 'customsearch#result',
      title: '',
      htmlTitle: '',
      link: 'assets/400x200.png',
      displayLink: 'www.ebay.com',
      snippet: '',
      htmlSnippet: '',
      mime: 'image/jpeg',
      image: {
        contextLink: '',
        height: 100,
        width: 100,
        byteSize: 100,
        thumbnailLink: 'assets/400x200.png',
        thumbnailHeight: 100,
        thumbnailWidth: 100,
      },
    },
  ],
};

export const images: GoogleImage[] = [
  {
    type: 'image/jpeg',
    url: 'assets/400x200.png',
    width: 100,
    height: 100,
    size: 100,
    thumbnail: {
      url: 'assets/400x200.png',
      width: 100,
      height: 100,
    },
  },
  {
    type: 'image/jpeg',
    url: 'assets/400x200.png',
    width: 100,
    height: 100,
    size: 100,
    thumbnail: {
      url: 'assets/400x200.png',
      width: 100,
      height: 100,
    },
  },
];
