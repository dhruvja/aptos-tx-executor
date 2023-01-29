import * as React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home";
import ReactGA from "react-ga";
const TRACKING_ID = "UA-84290080-2";
ReactGA.initialize(TRACKING_ID);

export const App = () => {
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <Router>
      <Switch>
        <Route
          path="/:network/:moduleAddress/:moduleName/:functionIndex"
          component={Home}
        />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};
