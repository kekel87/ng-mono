import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Log } from '../models/log';

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private httpClient: HttpClient) {}

  getLogs(): Observable<Log[]> {
    return of([
      {
        id: uuidv4(),
        title: 'Tour de la Gironde',
        bbox: [0, 0, 0, 0],
        tags: ['first', 'log'],
        startDate: '2023-09-21',
        endDate: '2023-09-28',
        entries: [
          {
            id: uuidv4(),
            title: 'Jour 1',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/gironde/jour_1.gpx',
          },
          {
            id: uuidv4(),
            title: 'Jour 2',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/gironde/jour_2.gpx',
          },
          {
            id: uuidv4(),
            title: 'Jour 3',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/gironde/jour_3.gpx',
          },
          {
            id: uuidv4(),
            title: 'Jour 4',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/gironde/jour_4.gpx',
          },
          {
            id: uuidv4(),
            title: 'Jour 5',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/gironde/jour_5.gpx',
          },
          {
            id: uuidv4(),
            title: 'Jour 6',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/gironde/jour_6.gpx',
          },
          {
            id: uuidv4(),
            title: 'Jour 7',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/gironde/jour_7.gpx',
          },
          {
            id: uuidv4(),
            title: 'Jour 8',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/gironde/jour_8.gpx',
          },
        ],
      },
      {
        id: uuidv4(),
        title: 'Tour de la Creuse',
        bbox: [0, 0, 0, 0],
        tags: ['first', 'log'],
        startDate: '2023-08-20',
        endDate: '2023-08-25',
        entries: [
          {
            id: uuidv4(),
            title: "La Souterraine - Bourg'd'Hem",
            bbox: [0, 0, 0, 0],
            gpx: 'assets/creuse/jour_1.gpx',
          },
          {
            id: uuidv4(),
            title: "Bourg'd'Hem - Chambon-sur-voueize",
            bbox: [0, 0, 0, 0],
            gpx: 'assets/creuse/jour_2.gpx',
          },
          {
            id: uuidv4(),
            title: 'Chambon-sur-voueize - Lac de la Vaud Galage',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/creuse/jour_3.gpx',
          },
          {
            id: uuidv4(),
            title: 'Lac de la Vaud Galage - Châtelus-le-Marcheix',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/creuse/jour_4.gpx',
          },
          {
            id: uuidv4(),
            title: 'Châtelus-le-Marcheix - La Souterraine',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/creuse/jour_5.gpx',
          },
        ],
      },
      {
        id: uuidv4(),
        title: 'Narbonne Cyclisme',
        bbox: [0, 0, 0, 0],
        description: 'This is my first log',
        tags: ['first', 'log'],
        startDate: '2023-03-18T08:00:00.000Z',
        endDate: '2023-03-18T17:00:00.000Z',
        entries: [
          {
            id: uuidv4(),
            title: 'Narbonne Cyclisme',
            bbox: [0, 0, 0, 0],
            gpx: 'assets/activity_11224180854.gpx',
          },
        ],
      },
    ]);
  }

  loadGpx(gpx: string): Observable<string> {
    return this.httpClient.get(gpx, { responseType: 'text' });
  }
}
