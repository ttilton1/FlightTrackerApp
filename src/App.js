//import logo from './logo.svg';
import { Link} from 'react-router-dom';
import './App.css';
function App() {
  return (
    <div>
    <div>
    Welcome to Moonware flight tracker
    </div>
    <div>
     <Link to={`./flights`}>Live Flight List</Link>
    </div>
    <div>
    <Link to={`./map`}>Live Flight Map</Link>
    </div>
    </div>
  );
}

export default App;
