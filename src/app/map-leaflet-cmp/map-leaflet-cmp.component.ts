import { Component, OnInit } from '@angular/core';
import placesPMR from '../../assets/MMM_MTP_PlacesReserv.json'

import L from "leaflet";
// import * as Gp from 'geoportal-extensions-leaflet';

import {Services, LExtended} from 'geoportal-extensions-leaflet';

@Component({
  selector: 'app-map-leaflet-cmp',
  templateUrl: './map-leaflet-cmp.component.html',
  styleUrls: [
  './map-leaflet-cmp.component.css'
  ]
})

export class MapLeafletCmpComponent implements OnInit {

  constructor() { }

    ngOnInit() {
        var createMap = function() {
            // Création de la map
            /*var layer = LExtended.geoportalLayer.WMTS({
              layer : "ORTHOIMAGERY.ORTHOPHOTOS"
            });*/

            var layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

            var map  = L.map('map', {
              zoom : 19,
              center : L.latLng(43.610769, 3.876716)
            });

            layer.addTo(map);

            // Ajout des extensions
            //var iso = LExtended.geoportalControl.Isocurve();
            //map.addControl(iso);
            var layerSwitcher = LExtended.geoportalControl.LayerSwitcher();
            //map.addControl(layerSwitcher);
            //var mp = LExtended.geoportalControl.MousePosition();
            //map.addControl(mp);
            var route = LExtended.geoportalControl.Route();
            map.addControl(route);
            //var reverse = LExtended.geoportalControl.ReverseGeocode();
            //map.addControl(reverse);
            var search = LExtended.geoportalControl.SearchEngine();
            map.addControl(search);
            //var measureProfil = LExtended.geoportalControl.ElevationPath();
            //map.addControl(measureProfil);

            var geojson = L.geoJson(placesPMR,{
              style: function (feature) {
                      return feature.properties && feature.properties.style;
                  },
              onEachFeature: function (feature, layer) {
                var popupcontent = [];
                for (var prop in feature.properties) {
                    popupcontent.push(prop + ": " + feature.properties[prop]);
                }
                layer.bindPopup(popupcontent.join("<br />"));
            
            },
                  pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 8,
              fillColor: '#ff7800',
              color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
              }
         }).addTo(map);

         //L.control.locate().addTo(map);

         //map.locate({setView: true, maxZoom: 16, watch: true});

         map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
         .on('locationfound', function(e){
             //var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
             var circle = L.circle([e.latitude, e.longitude], e.accuracy/4, {
                 weight: 2,
                 color: 'blue',
                 fillColor: '#cacaca',
                 fillOpacity: 0.2
             }).bindPopup('Your are here :)');
             //map.addLayer(marker);
             map.addLayer(circle);
         })
        .on('locationerror', function(e){
             console.log(e);
             alert("Location access denied.");
         });


        




      L.control.watermark({ position: 'topleft' }).addTo(map);
      this.geolocateCurrentPosition(map);


        }





        Services.getConfig({
            apiKey : "jhyvi0fgmnuxvfv0zjzorvdn",
            timeOut : 20000,
            onSuccess : createMap
        });
    }


      

/*
    maPosition(position) {
      var infopos = "Position déterminée :\n";
      infopos += "Latitude : "+position.coords.latitude +"\n";
      infopos += "Longitude: "+position.coords.longitude+"\n";
      infopos += "Altitude : "+position.coords.altitude +"\n";
      document.getElementById("infoposition").innerHTML = infopos;
    }
    */

   geolocateCurrentPosition(map) {

    map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
    .on('locationfound', function(e){
        //var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
        var circle = L.circle([e.latitude, e.longitude], e.accuracy/4, {
            weight: 2,
            color: 'blue',
            fillColor: '#cacaca',
            fillOpacity: 0.2
        }).bindPopup('Your are here :)');
        //map.addLayer(marker);
        map.addLayer(circle);
    })
   .on('locationerror', function(e){
        console.log(e);
        alert("Location access denied.");
    });

  }


  y = L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
        var img = L.DomUtil.create('img');

        img.src = '../../assets/images/logoIGN.png';
        img.style.width = '30px';
        L.DomEvent.on(img, 'click', function (ev) {
          map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
          .on('locationfound', function(e){
              //var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
              var circle = L.circle([e.latitude, e.longitude], e.accuracy/4, {
                  weight: 2,
                  color: 'blue',
                  fillColor: '#cacaca',
                  fillOpacity: 0.2
              }).bindPopup('Your are here :)');
              //map.addLayer(marker);
              map.addLayer(circle);
          })
         .on('locationerror', function(e){
              console.log(e);
              alert("Location access denied.");
          });      
          L.DomEvent.stopPropagation(ev);
        });
        return img;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});


  x = L.control.watermark = function(opts) {
    return new L.Control.Watermark(opts);
}

}
