import { Data, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './FlightsMap.css';
import { Marker } from "@react-google-maps/api";
import axios from "axios";

export const FlightsMap = () => {
    const center = {
        lat: Number(33.9438),
        lng: Number(-118.4091)
        };
    //const FLIGHT_LOCATIONS_INITIAL = [ {...center, heading: 0}];
    const [map, setMap] = useState(null);
    const [flightLocations, setFlightLocations] = useState([]);
    const extractPosition = (flightData) => {
        const coordinates = [];
        for(let flight of flightData) {
            const lat = Number(flight.last_position.latitude);
            const lng = Number(flight.last_position.longitude);
            const heading = Number(flight.last_position.heading);

            coordinates.push({lat, lng, heading});
        }
        return coordinates;
    }
    const fetchFlights= async () => {
        try {
            const response = await axios.get('https://aeroapi.flightaware.com/aeroapi/flights/search/advanced?query=%7Borig_or_dest+KLAX%7D+%7B%3C%3D+alt+30000%7D+%7Bmatch+ident+UAL*%7D',
            {
                headers: {
                    Accept: "application/json; charset=UTF-8",
                    "x-apikey":"sSQnuIzCEYNpeGY5li5gpSHwPU5dldtB",
                },
            });
            console.log('JFlights', response);
            return response;
        } catch (e) {
            console.error('unable to fetch flights', e);
        }
    }

    useEffect(() => {
        let interval
        interval = setInterval(() => {
            // I use axios like: axios.get('/user?ID=12345').then
            new Promise(() => fetchFlights().then((response) => {
                console.log('in interval', response);
                if (response) {
                    console.log('TFlights', response);
                    const flightData = response.data.flights;
                    const flightCoordinates = extractPosition(flightData);
                    setFlightLocations(flightCoordinates);;
                } else {
                   return () => clearInterval(interval);
                }    
            }));
        }, 3000);
        return () => clearInterval(interval);
        }, []);
    const containerStyle = {
        width: '100%',
        height: '95vh'
      };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyA8-1ZmhLDCMJKTXJrSxnQvXvrWIwgsvEQ"
      });

    const onLoad = useCallback(() => {
        const bounds = new window.google.maps.LatLngBounds(center);
        map?.fitBounds(bounds);
        setMap(map);
    }, []);

    return (
        <div className="flights-map">
            <div className="link-container-map">
                <h2>Current United Airlines Flights around LAX</h2>
                <div className="to-list-button">
                <Link to="/flights" replace><h5 className="flight-list-button">Go to Flight List</h5></Link>

                </div>
            </div>
            <div className="map-container">
            { isLoaded ? <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                //onUnmount={onUnmount}
            >
                { /* Child components, such as markers, info windows, etc. */ }
                {flightLocations && flightLocations.map(({ lat, lng, heading}) => {
                      const svgMarker = {
                        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,//"M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                        size: new window.google.maps.Size(50, 60),
                        fillColor: "red",
                        strokeColor: "red",
                        fillOpacity: 1,
                        strokeWeight: .5,
                        rotation: heading,
                        scale: 1,
                        anchor: new window.google.maps.Point(0, 0),
                      };
                    return <Marker id="arrow" position={{lat, lng}} icon={svgMarker} />
                })}
                <></>
            </GoogleMap> : <></>}
            </div>
        </div>
    )
}
