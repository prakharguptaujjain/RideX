import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "../../components/navbar.component"
import ExercisesList from "../../components/exercises-list.component";
import EditExercise from "../../components/edit-exercise.component";
import Rides from "../../components/rides.component";
import Ride from "../../components/ride.component";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import switch
import { Switch } from "react-router-dom";

import Card from "components/Card/Card.js";


// import CreateUser from "./components/create-user.component";
function SuperUser() {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path="/admin/SuperAdmin" component={ExercisesList} />
          <Route exact path="/admin/SuperAdmin/rides/:id" component={Rides} />
          {/* <Route exact path="/admin/SuperAdmin/ride/:id" component={Ride} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default SuperUser;
