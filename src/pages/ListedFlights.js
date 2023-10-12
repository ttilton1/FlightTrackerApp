import { useEffect, useState } from "react";
import axios, {isCancel, AxiosError} from 'axios';
import Modal from 'react-modal';
import { Link } from "react-router-dom";
import './ListedFlights.css';
// curl -X GET "https://aeroapi.flightaware.com/aeroapi/flights/search/advanced?query=%7Borig_or_dest+KLAX%7D+%7B%3C%3D+alt+30000%7D+%7Bmatch+ident+UAL*%7D" \
//  -H "Accept: application/json; charset=UTF-8" \
//  -H "x-apikey:  sSQnuIzCEYNpeGY5li5gpSHwPU5dldtB" \

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

const AERO_API_URL = "https://aeroapi.flightaware.com/aeroapi/flights/search/advanced?query=%7Borig_or_dest+KLAX%7D+%7B%3C%3D+alt+30000%7D+%7Bmatch+ident+UAL*%7D";
//const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=10';
const GET_OPTIONS = {
    headers: {
        //Authorization: 
        "x-apikey": "sSQnuIzCEYNpeGY5li5gpSHwPU5dldtB",
        Accept: "application/json; charset=UTF-8"
    },
    // body: JSON.stringify({
    //     a: 10,
    //     b: 20,
    //   }),
}
//UNBLOCKED AT 3:41 pm

const INIT_DATA = {
    status: 'NA',
    origin: 'NA',
    destinationAirport: 'NA',
    destinationGate: 'NA',
    terminal: 'NA',
    estimatedOnLanding: 'NA',
    estimatedInGateArrival: 'NA',
    aircraftype: 'NA',
}
export const ListedFlights = () => {
    const [flights, setFlights] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFlightInfo, setSelectedFlightInfo] = useState(INIT_DATA);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const flights = await axios.get('https://aeroapi.flightaware.com/aeroapi/flights/search/advanced?query=%7Borig_or_dest+KLAX%7D+%7B%3C%3D+alt+30000%7D+%7Bmatch+ident+UAL*%7D',
                {
                    headers: {
                        Accept: "application/json; charset=UTF-8",
                        "x-apikey":"sSQnuIzCEYNpeGY5li5gpSHwPU5dldtB",
                    },
                });
                console.log('Flights', flights)
                setFlights(flights.data.flights);
                //WOULD DO FORESIGHT PREDICTION AND APPEND VALUE FOR GATE HERE
                // for(let flight of flights){
                //     if(flight.gate_destination){
                //         const flights = await axios.get('https://aeroapi.flightaware.com/aeroapi/flights/search/advanced?query=%7Borig_or_dest+KLAX%7D+%7B%3C%3D+alt+30000%7D+%7Bmatch+ident+UAL*%7D',
                // {
                //     headers: {
                //         Accept: "application/json; charset=UTF-8",
                //         "x-apikey":"sSQnuIzCEYNpeGY5li5gpSHwPU5dldtB",
                //     },
                // });
                //     }
                // }
            } catch (e) {
                console.error('Error fetching flights',e);
            }
            //setPosts(fetchedPosts);
        }
        fetchPosts();
    }, []);

    const clickFlight = (props) => {
        return () => {
            //console.log('t', props.last_position.update_type);
            setSelectedFlightInfo(extractFlightInfoFromProps(props));
            setModalIsOpen(true);
        };
    };
// S Scheduled, F Filed, A Active, Z Completed, or X Cancelled.
    const extractFlightInfoFromProps = (props) => {
        const UPDATE_TYPE_TO_STRING = new Map([['A', 'Active'], 
                ['S', 'Scheduled'],
                ['F', 'Filed'],
                ['Z', 'Completed'],
                ['X', 'Cancelled']])
        const flightInfo = {
            ...selectedFlightInfo,
            status: UPDATE_TYPE_TO_STRING.get(props.last_position?.update_type) ?? props.last_position.update_type,
            origin: `${props.origin.name} (${props.origin.code_iata})`,
            destinationAirport: `${props.destination.name} (${props.destination.code_iata})`,
            destinationGate: `${props.gate_destination ?? 'unknown'}`,
            terminal: `${props.gate_destination ?? 'unknown'}`,
            estimatedOnLanding: props.predicted_on,
            estimatedInGateArrival: props.predicted_in,
            aircraftype: props.aircraft_type
        }
        return flightInfo;
    }

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const FlightModal = () => {
        const {
            status,
            origin,
            destinationAirport,
            destinationGate,
            terminal,
            estimatedOnLanding,
            estimatedInGateArrival,
            aircraftype
        } = selectedFlightInfo;
        return (
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal">
            <button onClick={closeModal}>close</button>
            <div>Flight information</div>
            <table>
                <thead>
                    <tr>
                        <th>
                            Field
                        </th>
                        <th>
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>
                        Status
                        </th>
                        <td>
                            {status}
                        </td>
                    </tr>
                    <tr>
                        <th>
                        Origin
                        </th>
                        <td>
                            {origin}
                        </td>
                    </tr>
                    <tr>
                        <th>
                        Destination Airport
                        </th>
                        <td>
                            {destinationAirport}
                        </td>
                    </tr>
                    <tr>
                        <th>
                        Destination Gate
                        </th>
                        <td>
                            {destinationGate}
                        </td>
                    </tr>
                    <tr>
                        <th>
                        Terminal
                        </th>
                        <td>
                            {terminal}
                        </td>
                    </tr>
                    <tr>
                        <th>
                        Estimated On Landing
                        </th>
                        <td>
                            {estimatedOnLanding}
                        </td>
                    </tr>
                    <tr>
                        <th>
                        Estimated in Gate
                        </th>
                        <td>
                            {estimatedInGateArrival}
                        </td>
                    </tr>
                    <tr>
                        <th>
                        Aircraft Type
                        </th>
                        <td>
                            {aircraftype}
                        </td>
                    </tr>
                </tbody>
            </table>
        </Modal>
        );
    }

    return (
        <div className='moonware-body'>
            <h2>United Airlines Flight List</h2>
            <FlightModal />
            <ol>
            {
                flights && flights.map((flight) => {
                    return (<li onClick={clickFlight(flight)} value={flight.ident}>{flight.ident}</li>);
                })
            }
            </ol>
            <div className="link-container">
            <Link to="/map" replace><h3>Go to Live Flight Map</h3></Link>
            </div>
        </div>
    );
}