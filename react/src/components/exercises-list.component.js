import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
 import {Table} from 'react-bootstrap';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "components/CustomButtons/Button.js"
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Navbar1 from "components/navbar.component.js";



const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Space Grotesk', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

 

const Exercise = props => (
  console.log(props.exercise),
  <tr>
    <Link to={`SuperAdmin/rides/${props.exercise.username}`}>
        {props.exercise.username}
      </Link>
    <td>{props.exercise.email}</td>
    <td>{props.exercise.first_name}</td>
    <td>{props.exercise.last_name}</td>
  </tr>
)

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);
    this.state = { exercises: [] };
  }

  componentDidMount() {
    axios
      .post('http://127.0.0.1:8000/staff/users/', {
        access_token: localStorage.getItem('access_token'),
      })
      .then((response) => {
        this.setState({ exercises: response.data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  exerciseList() {
    console.log(this.state.exercises);
    return this.state.exercises.map((current_exer) => {
      return <Exercise exercise={current_exer} key={current_exer.id} />;
    });
  }

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">
                <Navbar1 />
              </CardHeader>

              <CardBody>
                <Table className="table" responsive>
                  <thead className="thead-light">
                    <tr>
                    {/* <th>Rides</th> */}
                      <th>Username</th>
                      <th>Email</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                    </tr>
                  </thead>

                  <tbody>{this.exerciseList()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
