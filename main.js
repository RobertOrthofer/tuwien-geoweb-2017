import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Stamen from 'ol/source/Stamen';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';
import {fromLonLat, toLonLat} from 'ol/proj';
import sync from 'ol-hashed';

const map = new Map({
  target: 'map',
  view: new View({
    center: fromLonLat([16.37, 48.2]),
    zoom: 13
  })
});
map.addLayer(new TileLayer({
  source: new Stamen({
    layer: 'watercolor'
  })
}));

const bezirkeLayer = new VectorLayer({
  source: new Vector({
    url: 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEZIRKSGRENZEOGD&srsName=EPSG:4326&outputFormat=json',
    format: new GeoJSON()
  })
});
map.addLayer(bezirkeLayer);

const layer = new VectorLayer({
  source: new Vector({
    url: 'https://student.ifip.tuwien.ac.at/geoweb/2017/ifip/map/postgis_geojson.php',
    format: new GeoJSON()
  })
});
map.addLayer(layer);

layer.setStyle(function(feature) {
  return new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: 'rgba(232, 12, 12, 1)'
      }),
      stroke: new Stroke({
        color: 'rgba(127, 127, 127, 1)',
        width: 1
      })
    })
  });
});

sync(map);

var overlay = new Overlay({
  element: document.getElementById('popup-container'),
  positioning: 'bottom-center',
  offset: [0, -10],
  autoPan: true
});
map.addOverlay(overlay);
overlay.getElement().addEventListener('click', function() {
  overlay.setPosition();
});

map.on('singleclick', function(e) {
  var markup = '';
  map.forEachFeatureAtPixel(e.pixel, function(feature) {
    var properties = feature.getProperties();
    markup += `${markup && '<hr>'}<table>`;
    for (var property in properties) {
      if (property != 'geometry') {
        markup += `<tr><th>${property}</th><td>${properties[property]}</td></tr>`;
      }
    }
    markup += '</table>';
  }, {
    layerFilter: (l) => l === layer
  });
  if (markup) {
    document.getElementById('popup-content').innerHTML = markup;
    overlay.setPosition(e.coordinate);
  } else {
    overlay.setPosition();
    var pos = toLonLat(e.coordinate);
    window.location.href =
        'https://student.ifip.tuwien.ac.at/geoweb/2017/ifip/map/feedback.php?pos=' +
        pos.join(' ');
  }
});

function calculateStatistics() {
  const feedbacks = layer.getSource().getFeatures();
  const bezirke = bezirkeLayer.getSource().getFeatures();
  if (feedbacks.length > 0 && bezirke.length > 0) {
    for (var i = 0, ii = feedbacks.length; i < ii; ++i) {
      var feedback = feedbacks[i];
      for (var j = 0, jj = bezirke.length; j < jj; ++j) {
        var bezirk = bezirke[j];
        var count = bezirk.get('FEEDBACKS') || 0;
        var feedbackGeom = feedback.getGeometry();
        if (feedbackGeom &&
            bezirk.getGeometry().intersectsCoordinate(feedbackGeom.getCoordinates())) {
          ++count;
        }
        bezirk.set('FEEDBACKS', count);
      }
    }
  }
}
bezirkeLayer.getSource().once('change', calculateStatistics);
layer.getSource().once('change', calculateStatistics);

bezirkeLayer.setStyle(function(feature) {
  var fillColor;
  const feedbackCount = feature.get('FEEDBACKS');
  if (feedbackCount <= 1) {
    fillColor = 'rgba(247, 252, 185, 0.7';
  } else if (feedbackCount < 5) {
    fillColor = 'rgba(173, 221, 142, 0.7)';
  } else {
    fillColor = 'rgba(49, 163, 84, 0.7)';
  }
  return new Style({
    fill: new Fill({
      color: fillColor
    }),
    stroke: new Stroke({
      color: 'rgba(4, 4, 4, 1)',
      width: 1
    })
  });
});
