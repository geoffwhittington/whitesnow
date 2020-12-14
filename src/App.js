import logo from './logo.svg';
import {BrowserRouter as Router, Route} from "react-router-dom"
import Search from "./screens/Search";
import Index from "./screens/Index";

import './App.css';

function App() {
  return (
     <Router basename={`${process.env.REACT_APP_DEPLOY_CONTEXT}`}>
	  <Route path="/" exact component={Index} />
	  <Route path="/Search/:q" exact component={Search} />
     </Router>
  );
}

export default App;
