import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WeatherParams } from '../models/weather-params';
import { WeatherResponse } from '../models/weather-response';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  readonly baseUrl = 'https://api.open-meteo.com/v1/meteofrance';

  constructor(private httpClient: HttpClient) {}

  get(params: WeatherParams): Observable<WeatherResponse> {
    return this.httpClient.get<WeatherResponse>(this.baseUrl, {
      params: new HttpParams({ fromObject: { ...params } }),
    });
  }
}
