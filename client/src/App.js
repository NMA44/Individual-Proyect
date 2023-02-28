import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./views/Home/home";
import LandingPage from "./views/Landing Page/landingPage";
import CreateDog from "./components/CreateDog/createDog";
import DetailDog from "./components/DetailDog/dogDetail";
//import style from "./components/styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/createDog" component={CreateDog} />
          <Route exact path="/dogs/:id" component={DetailDog} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
