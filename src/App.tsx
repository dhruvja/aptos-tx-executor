import * as React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home";

export const App = () => (
  <Router>
    <Switch>
      <Route path="/:network/:moduleAddress/:moduleName/:functionIndex" component={Home} />
      <Route path="/" component={Home} />
      {/* <Route path="/" component={CallToActionWithAnnotation} /> */}
    </Switch>
  </Router>
);
