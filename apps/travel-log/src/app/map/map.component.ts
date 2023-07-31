import { Component, OnInit } from '@angular/core';
import 'leaflet-gpx';
import { Map, TileLayer, GPX, LeafletEvent } from 'leaflet';

@Component({
  standalone: true,
  selector: 'log-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map!: Map;

  ngOnInit(): void {
    this.map = new Map('map', {
      center: [43.6, 1.433333],
      zoom: 6,
    });

    const tiles = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);

    const gpx = new GPX('assets/test.gpx', {
      async: true,
      marker_options: {
        startIconUrl: undefined,
        endIconUrl: undefined,
        shadowUrl: undefined,
      },
    });

    gpx.on('loaded', (e: LeafletEvent) => {
      this.map.fitBounds(e.target.getBounds());
    });

    gpx.addTo(this.map);
  }
}
