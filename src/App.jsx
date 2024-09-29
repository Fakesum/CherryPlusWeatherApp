import React, { useEffect, useReducer, useState } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, Popup, useMap } from 'react-leaflet';
import WeatherDisplay from './WeatherDisplay';
import './App.css';
import 'leaflet/dist/leaflet.css';

import { Helmet } from 'react-helmet';

import ReactLoading from 'react-loading'

import markers from './big_cities.json'
// import { ScatterBoxLoader } from "react-awesome-loaders"

const map_theme_urls = ["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"];

var light_theme = true;
var map_theme_url = map_theme_urls[0];

var locations_hidden = true;

var search_locations = [];

function ChangeCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
    map.setZoom(zoom)
  }, [center, map]);
  return null;
}

function App() {
  
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState([13.067439, 80.237617]);
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [search_loading, setSearchLoading] = useState(false);
  const [temp_marker, setTempMarker] = useState(undefined);

  function changeTheme(){
    // this can be done in a more smart way but that is not really required here.

    light_theme = !light_theme;

    map_theme_url = light_theme ? map_theme_urls[0] : map_theme_urls[1];

    forceUpdate(); // this is quite hacky cause I didn't feel like writing an entire
    // react component class for such a simple site.
  }

  function showStreets(e){

    if (e.code == "Enter"){
      if (document.querySelector(".address-input").value == ""){
        return; // Cause OH God it crashes, And I have no idea WHY!!!.
      }
      setSearchLoading(true);
      
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${document.querySelector(".address-input").value}&limit=5&appid=da00953907b5ec2c5db00f53ffd89e68`)
        .then(res => {if (res.cod == 400){return [];}; return res.json()})
        .then(res => {if (res != []){
          locations_hidden = false;
          search_locations = res;
          setSearchLoading(false);
        }})
        .catch(e=>{});
        forceUpdate();
    }
  }

  function checkWeather(marker_data, popupData, setIsVisible){

    /* I am aware this is unsafe as all hell. 
    saving this in a secrets file, is on the todo list.*/
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${marker_data.location.lat}&lon=${marker_data.location.lon}&appid=da00953907b5ec2c5db00f53ffd89e68`)
      .then(res => {return res.json()})
      .then(res => {setIsVisible(false);popupData(res);forceUpdate();})
      .catch(res => {});
  }

  function makeTempMarker(search_result){
    setTempMarker(search_result);

    setCenter([search_result.lat, search_result.lon]);
    setZoom(10);

    forceUpdate();
  }

  return (
    <div className="App">
      <Helmet>
        <title>Weather App</title>
      </Helmet>
      <MapContainer center={center} zoom={zoom}>
        <ChangeCenter center={center} zoom={zoom}/>
        <div className="address-fillbar">
          <input
            name="address"
            placeholder="Search For Places here..."
            type="text"
            autoComplete="street-address"
            className="address-input"
            onKeyDown={showStreets}
          />
          {search_loading ? <ReactLoading type="bubbles" className="loading"></ReactLoading>:<ul className="ul-locations" hidden={locations_hidden}>
            {
              search_locations.map((search_result, idx) => {
                return <li className="ul-location-item" key={`ul-location-item-${idx}`}>
                  <button className="location-button" onClick={(e)=>{makeTempMarker(search_result);}}>{search_result.name}</button>
                </li>
              })
            }
          </ul>}
        </div>
        <div className="theme-toggle">
          <label className="switch">
            <span className="sun"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r="5" cy="12" cx="12"></circle><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path></g></svg></span>
            <span className="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></svg></span>   
            <input type="checkbox" className="input" onChange={changeTheme}/>
            <span className="slider"></span>
          </label>
        </div>
        <TileLayer url={map_theme_url} attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
        {
          markers.map((marker_data, idx) => {
            var [isLoading, setIsLoading] = useState(true);
            var [popupData, setPopupData] = useState({});
            return <Marker position={marker_data.location} key={`marker-${idx}`} eventHandlers={{click: (e) => {checkWeather(marker_data, setPopupData, setIsLoading)}}} >
              <Tooltip>
                {marker_data.name}
              </Tooltip>
              <Popup>
                {isLoading ? <ReactLoading type="bubbles" className="loading"></ReactLoading> : <WeatherDisplay weatherData={popupData}></WeatherDisplay>}
              </Popup>
            </Marker>
          })
        }
        {
          (()=>{
            var [tempIsLoading, setTempIsLoading] = useState(true);
            var [popupData, setPopupData] = useState({});
            
            if (temp_marker == undefined){
              return;
            }

            return <Marker position={[temp_marker.lat, temp_marker.lon]} eventHandlers={{click: (e) => {checkWeather({"location": {"lat": temp_marker.lat, "lon": temp_marker.lon}, "name": temp_marker.name}, setPopupData, setTempIsLoading)}}}>
              <Tooltip>
                {temp_marker.name}
              </Tooltip>
              <Popup>
                {tempIsLoading ? <ReactLoading type="bubbles" className="loading"></ReactLoading> : <WeatherDisplay weatherData={popupData}></WeatherDisplay>}
              </Popup>
            </Marker>
          }
          )()
        }
      </MapContainer>
      <footer>© -------------------------, Ansh Mathur</footer>
    </div>
  );
}

export default App;
