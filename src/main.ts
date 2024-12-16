import {empty} from '@versatiles/style';
import {
  type LayerSpecification,
  Map as MapLibre,
  TerrainControl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {administrative} from './layers/administrative';
import {infrastructure} from './layers/infrastructure';
import {labels} from './layers/labels';
import {land} from './layers/land';
import {poi} from './layers/poi';
import {water} from './layers/water';
import {addTerrain} from './terrain';

const style = empty({
  tiles: ['/tiles/osm/{z}/{x}/{y}'],
  baseUrl: 'https://tiles.versatiles.org',
  glyphs: '/assets/fonts/{fontstack}/{range}.pbf',
  sprite: [
    {id: 'versatiles', url: '/assets/sprites/sprites'},
    {
      id: 'osm',
      url: 'https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite',
    },
  ],
});

console.log(style);

const layers: LayerSpecification[] = [
  {
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#edf1e7',
    },
  },
  ...water,
  ...land,
  ...administrative,
  ...infrastructure,
  ...labels,
  ...poi,
];

const map = new MapLibre({
  container: 'map',
  style: {...style, layers},
  center: [10, 45],
  zoom: 4,
  maxZoom: 15,
  hash: true,
  // bounds: []
});

map.on('load', () => {
  addTerrain(map);

  // debug
  map.on('moveend', () => {
    const {
      _ne: {lng: neLng, lat: neLat},
      _sw: {lng: swLng, lat: swLat},
    } = map.getBounds();
    console.log(
      `Zoom: ${map.getZoom()}, bounds: [${swLng}, ${swLat}, ${neLng}, ${neLat}]`,
    );
  });
});
