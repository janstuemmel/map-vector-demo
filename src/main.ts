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
import {water} from './layers/water';

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
];

const map = new MapLibre({
  container: 'map',
  style: {...style, layers},
  center: [10, 45],
  zoom: 4,
  maxZoom: 14,
  // bounds: []
});

map.on('load', () => {
  map.addSource('aws-terrain', {
    type: 'raster-dem',
    tiles: [
      'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
    ],
    encoding: 'terrarium',
    tileSize: 256,
    attribution: 'tbd',
  });

  map.addLayer(
    {
      id: 'hills',
      source: 'aws-terrain',
      type: 'hillshade',
      layout: {visibility: 'visible'},
      maxzoom: 15,
      paint: {
        'hillshade-exaggeration': 1,
        'hillshade-accent-color': 'hsla(0, 0%, 0%, 0.5)',
        'hillshade-highlight-color': 'hsla(100, 100%, 100%, 0.3)',
        'hillshade-shadow-color': 'hsla(0, 0%, 0%, 0.3)',
      },
    },
    'water-ocean',
  );

  map.on('moveend', () => {
    const {
      _ne: {lng: neLng, lat: neLat},
      _sw: {lng: swLng, lat: swLat},
    } = map.getBounds();
    console.log(
      `Zoom: ${map.getZoom()}, bounds: [${swLng}, ${swLat}, ${neLng}, ${neLat}]`,
    );
  });

  // 3D terrain
  // map.addControl(new TerrainControl({source: 'aws-terrain', exaggeration: 1}));
  // map.setTerrain({source: 'aws-terrain', exaggeration: 1});
});
