import 'ol/ol.css';
import 'javascript-autocomplete/auto-complete.css';
import GeoJSON from 'ol/format/geojson';
import Overlay from 'ol/overlay';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import proj from 'ol/proj';
import sync from 'ol-hashed';
import {apply} from 'ol-mapbox-style';
import AutoComplete from 'javascript-autocomplete';

var onload, selected, source;

var map = apply('map-container', 'data/style.json');
sync(map);

function fit() {
  map.getView().fit(source.getExtent(), {
    maxZoom: 19,
    duration: 250
  });
}

function getAddress(feature) {
  var properties = feature.getProperties();
  return (
    (properties.city || properties.name || '') +
    ' ' +
    (properties.street || '') +
    ' ' +
    (properties.housenumber || '')
  );
}

var searchResult = new VectorLayer({
  zIndex: 9999
});
map.addLayer(searchResult);

new AutoComplete({
  selector: 'input[name="q"]',
  source: function(term, response) {
    if (onload) {
      source.un('change', onload);
    }
    searchResult.setSource(null);
    source = new VectorSource({
      format: new GeoJSON(),
      url: 'https://photon.komoot.de/api/?q=' + term
    });
    onload = function(e) {
      var texts = source.getFeatures().map(function(feature) {
        return getAddress(feature);
      });
      response(texts);
      fit();
    };
    source.once('change', onload);
    searchResult.setSource(source);
  },
  onSelect: function(e, term, item) {
    selected = item.getAttribute('data-val');
    source.getFeatures().forEach(function(feature) {
      if (getAddress(feature) !== selected) {
        source.removeFeature(feature);
      }
    });
    fit();
  }
});

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
    if (properties['f_nr']) {
      markup += `${markup && '<hr>'}<table>`;
      for (var property in properties) {
        if (property != 'geometry') {
          markup += `<tr><th>${property}</th><td>${properties[property]}</td></tr>`;
        }
      }
      markup += '</table>';
    }
  });
  if (markup) {
    document.getElementById('popup-content').innerHTML = markup;
    overlay.setPosition(e.coordinate);
  } else {
    overlay.setPosition();
    var pos = proj.toLonLat(e.coordinate);
    window.location.href = 'https://student.ifip.tuwien.ac.at/geoweb/2017/ifip/feedback.php?pos=' +
        pos.join(' ');
  }
});

var loadedSources = {};
map.getLayers().on('add', function(e) {
  var source = e.element.getSource();
  if (source instanceof VectorSource) {
    source.once('change', function() {
      loadedSources[source.getUrl()] = source;
      if (Object.keys(loadedSources).length == 2) {
        var feedbacks = loadedSources['https://student.ifip.tuwien.ac.at/geoweb/2017/ifip/postgis_geojson.php'].getFeatures();
        var bezirke = loadedSources['https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEZIRKSGRENZEOGD&srsName=EPSG:4326&outputFormat=json'].getFeatures();
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
    });
  }
});
