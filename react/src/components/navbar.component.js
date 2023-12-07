import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

class Navbar1 extends Component {
  render() {
    const adminClientId = localStorage.getItem('admin_client_id');
    const adminRideId = localStorage.getItem('admin_ride_id');

    return (
      <Navbar collapseOnSelect expand="lg">
        <Navbar.Brand style={{ color: 'white' }} href="/admin/SuperAdmin">
          Home
        </Navbar.Brand>

        {adminClientId!=-1 && (
          <Navbar.Brand style={{ color: 'white' }} href={`/admin/SuperAdmin/rides/${adminClientId}`}>
            Rides
          </Navbar.Brand>
        )}
        {
          adminClientId==-1 && (
            <Navbar.Brand style={{ color: 'white' }} href={`/admin/SuperAdmin/rides/-1`}>
              Rides
            </Navbar.Brand>
          )
        }
        {/* {adminRideId!=-1 && (
          <Navbar.Brand style={{ color: 'white' }} href={`/admin/SuperAdmin/ride/${adminRideId}`}>
            Ride
          </Navbar.Brand>
        )}
        {
          adminRideId==-1 && (
            <Navbar.Brand style={{ color: 'white' }} href={`/admin/SuperAdmin/ride/-1`}>
              Ride
            </Navbar.Brand>
          )
        } */}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Navbar>
    );
  }
}

export default Navbar1;