import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';
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
        {/* make tripid as link */}
        <Link to={`127.0.0.1:8000/staff/view_ride/${props.exercise.trip_id}`}>
            {props.exercise.unique_id}
        </Link>
        <td>{props.exercise.trip_id}</td>
        <td>{props.exercise.trip_name}</td>
        <td>{props.exercise.driver_phone_number}</td>
        <td>{props.exercise.cab_number}</td>
        <td>{props.exercise.start_time}</td>
        <td>{props.exercise.end_time}</td>
        <td>{props.exercise.start_location_xcoordinate}</td>
        <td>{props.exercise.start_location_ycoordinate}</td>
        <td>{props.exercise.end_location_xcoordinate}</td>
        <td>{props.exercise.end_location_ycoordinate}</td>
        <td>{props.exercise.additional_notes}</td>
    </tr>
)

export default class ExercisesList extends Component {
    constructor(props) {
        super(props);
        this.state = { exercises: [] };
    }

    componentDidMount() {
        // set cookie of admin_ride_id which is the id after /
        localStorage.setItem('admin_ride_id', this.props.match.params.id);
        axios
            .post('http://127.0.0.1:8000/staff/ride/', {
                access_token: localStorage.getItem('access_token'),
                'trip_id': this.props.match.params.id,
            })
            .then((response) => {
                this.setState({ exercises: response.data.data });
            })
            .catch((error) => {
                console.log(error);
            });
            // {'trip_id': '1', 'unique_id': 'daewfweafwefaw3faw3', 'trip_name': 'aa', 'driver_phone_number': 'aa', 'cab_number': 'aa', 'start_time': datetime.datetime(2023, 12, 6, 21, 26, 11, tzinfo=datetime.timezone.utc), 'end_time': datetime.datetime(2023, 12, 6, 21, 26, 12, tzinfo=datetime.timezone.utc), 'start_location_xcoordinate': 'a', 'start_location_ycoordinate': 'a', 'end_location_xcoordinate': 'a', 'end_location_ycoordinate': 'aa', 'additional_notes': 'aa'} 
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
                                            <th>Unique Id</th>
                                            <th>Trip Id</th>
                                            <th>Trip Name</th>
                                            <th>Driver Phone Number</th>
                                            <th>Cab Number</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Start Location Xcoordinate</th>
                                            <th>Start Location Ycoordinate</th>
                                            <th>End Location Xcoordinate</th>
                                            <th>End Location Ycoordinate</th>
                                            <th>Additional Notes</th>
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

