import React from 'react';
import mapboxgl from 'mapbox-gl';

const MY_API_KEY = 'pk.eyJ1IjoieGFkdXhkIiwiYSI6ImNrM3pzZWs4MTBnamEza2w5NWtud2tnaTgifQ.Hs-vT6sMl-t2jA3DysdDvA'

class Map extends React.Component {
  // Code from the next few steps will go here
  constructor(props) {
    super(props);
    this.state = {
      lng: -49.28,
      lat: -25.43,
      zoom: 10
    };
  }

  componentDidMount() {
    mapboxgl.accessToken = MY_API_KEY
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [this.state.lng, this.state.lat], // starting position
      zoom: this.state.zoom // starting zoom
    })
    //geolocate control
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }), 'bottom-right'
    )
    //navigation control
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    //save coordinates
    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
      //  console.log(this.state.lat + '  ' + this.state.lng)
    });
  }

  async getMyLocation() {
    var latitude = this.state.lat
    var longitude = this.state.lng

    var requestURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + longitude + '%2C' + latitude + '.json?access_token=' + MY_API_KEY + '&cachebuster=1575986393639&autocomplete=false&types=place&proximity=-49.2647002%2C-25.4310789';
    //console.log(requestURL)
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
      var res = request.response;
      //console.log(JSON.stringify(res))
      //console.log(res)
      var city = res['features'][0] != undefined ? res['features'][0]['text'] : 'Não sei'
      console.log('CIDADE: ' + city)
    }

  }

  render() {
    //console.log(this.state.lat + '  ' + this.state.lng)
    return (
      <div>
        <div className='sidebarStyle'>
          <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
        </div>
        <button onClick={this.getMyLocation.bind(this)}>Onde estou?</button>
        <div ref={el => this.mapContainer = el} className='mapContainer' id='map' />
      </div>
    )
  }
}

export default Map