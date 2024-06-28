import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Body } from '../models/body';
import { HomesDataResponse } from '../models/home-data-response';
import { Measure } from '../models/measure';
import { MeasureParams } from '../models/measure-params';
import { RoomMeasureParams } from '../models/room-measure-params';

@Injectable({ providedIn: 'root' })
export class NetatmoService {
  readonly baseUrl = 'https://api.netatmo.com/api';

  constructor(private httpClient: HttpClient) {}

  getHomesData(): Observable<Body<HomesDataResponse>> {
    return this.httpClient.get<Body<HomesDataResponse>>(`${this.baseUrl}/homesdata`);
  }

  getMeasure(params: MeasureParams): Observable<Body<Measure[]>> {
    return this.httpClient.get<Body<Measure[]>>(`${this.baseUrl}/getmeasure`, {
      params: new HttpParams({ fromObject: { ...params } }),
    });
  }

  getRoomMeasure(params: RoomMeasureParams): Observable<Body<Measure[]>> {
    return this.httpClient.get<Body<Measure[]>>(`${this.baseUrl}/getroommeasure`, {
      params: new HttpParams({ fromObject: { ...params } }),
    });
  }
}
