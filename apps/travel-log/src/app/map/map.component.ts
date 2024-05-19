import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ofType } from '@ngrx/effects';
import { Store, ActionsSubject } from '@ngrx/store';
import 'leaflet-gpx';
import { BBox } from 'geojson';
import { Map, TileLayer, GeoJSON, LatLngBounds } from 'leaflet';
import { interval } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs/operators';

import { mapActions } from './store/map.actions';
import { layoutActions } from '../layout/store/layout.actions';

function bboxToLatLngBounds([c2, c1, c4, c3]: BBox): LatLngBounds {
  return new LatLngBounds([c1, c2], [c3, c4]);
}

@Component({
  standalone: true,
  selector: 'log-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map!: Map;
  private geoJsonLayer: any;

  constructor(
    private store: Store,
    private action$: ActionsSubject
  ) {
    this.action$
      .pipe(
        ofType(mapActions.fit),
        map(({ bbox }) => bboxToLatLngBounds(bbox)),
        takeUntilDestroyed()
      )
      .subscribe((bounds) => this.map.fitBounds(bounds));

    this.action$
      .pipe(
        ofType(layoutActions.sidenavStartAnimated),
        switchMap(() => interval(20).pipe(takeUntil(this.action$.pipe(ofType(layoutActions.sidenavEndAnimated)))))
      )
      .subscribe(() => {
        this.map.invalidateSize();
      });
  }

  ngOnInit(): void {
    this.map = new Map('map', {
      center: [43.6, 1.433333],
      zoom: 6,
    });
    this.geoJsonLayer = new GeoJSON().addTo(this.map);
    this.geoJsonLayer.addTo(this.map);

    const tiles = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);

    // const gpx = new GPX('assets/jour_1.gpx', {
    //   async: true,
    //   marker_options: {
    //     startIconUrl: undefined,
    //     endIconUrl: undefined,
    //     shadowUrl: undefined,
    //   },
    // });

    // gpx.on('loaded', (e: LeafletEvent) => {
    //   this.map.fitBounds(e.target.getBounds());
    // });

    // gpx.addTo(this.map);

    // this.store.select(logEntryObjectFeature.selectGeoJsonDisplayed).subscribe((logEntries) => {
    //   this.geoJsonLayer.clearLayers();
    //   this.geoJsonLayer.addData(logEntries.map(({ geoJson }) => geoJson));
    // });
  }
}
