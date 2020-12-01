import logo from './logo.svg';
import {BrowserRouter as Router, Route} from "react-router-dom"
import Search from "./screens/Search";
import './App.css';

function App() {
  return (
     <Router>
	  <Route path="/" exact component={Search} />
     </Router>
  );
}

export default App;
