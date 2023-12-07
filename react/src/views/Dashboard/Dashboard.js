import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";

import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Axios from "axios";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const [tl, setTL] = React.useState(false);
  const [total_trips, setTotalTrips] = React.useState(0);
  const [total_distance, setTotalDistance] = React.useState(0);
  const [total_time, setTotalTime] = React.useState(0);
  const [companions_cnt, setCompanionsCnt] = React.useState(0);
  const [notify, setNotify] = React.useState({
    message: "",
    error: false,
  });

  // onload
  React.useEffect(() => {
    Axios.post("http://localhost:8000/user/dashboard/", {  
      'access_token': localStorage.getItem("access_token"),
    })
      .then((res) => {
        console.log(res.data);
        const message = res.data.message;
        if (res.data.status === 200 || res.data.status === 201) {
          var data=res.data.data;
          setTotalTime(data.total_time);
          setTotalTrips(data.total_trips);
          setTotalDistance(data.total_distance);
          setCompanionsCnt(data.companions_cnt+1);
        } else {
          setNotify({
            ...notify,
            message: message,
            error: true,
          });
          setTL(true);
          window.location.href = "/login";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setNotify({
          ...notify,
          message: error,
          error: true,
        });
        setTL(true);
      });
  }, []);
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Trips</p>
              <h3 className={classes.cardTitle}>
                {total_trips}
                {/* <small>GB</small> */}
              </h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Get more space
                </a>
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Total Distance</p>
              <h3 className={classes.cardTitle}>{total_distance}</h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Time</p>
              <h3 className={classes.cardTitle}>{total_time}</h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Companions</p>
              <h3 className={classes.cardTitle}>{companions_cnt}</h3>
            </CardHeader>
            {/* <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Distance</h4>
              {/* <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p> */}
            </CardBody>
            {/* <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Time Taken</h4>
              {/* <p className={classes.cardCategory}>Last Campaign Performance</p> */}
            </CardBody>
            {/* <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Trips This Year</h4>
              {/* <p className={classes.cardCategory}>Last Campaign Performance</p> */}
            </CardBody>
            {/* <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title="Trips:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Last Week",
                // tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[]}
                    tasksIndexes={[0]}
                    tasks={bugs}
                  />
                )
              },
              {
                tabName: "Last Month",
                // tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[]}
                    tasksIndexes={[0]}
                    tasks={website}
                  />
                )
              },
              {
                tabName: "Last Year",
                // tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[]}
                    tasksIndexes={[0]}
                    tasks={server}
                  />
                )
              }
            ]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Companions</h4>
              <p className={classes.cardCategoryWhite}>
                These users can see all your trips
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Phone Number"]}
                tableData={[
                  ["1", "Prakhar Gupta", "1234123412"],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {tl && (
        <Snackbar
          place="tl"
          color={notify.error ? "danger" : "success"}
          message={notify.message}
          icon={AddAlert}
          open={tl}
          closeNotification={() => setTL(false)}
          close
        />
      )}
    </div>
  );
}
