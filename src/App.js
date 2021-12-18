import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; /* optional for styling like the :hover pseudo-class */

import USAMap from "react-usa-map";
import LeftHandSide from "./components/LeftHandSide";
import BarGraph from "./components/BarGraph";
import { numberWithCommas } from "./helper/conversion";

import swal from "sweetalert";
import NavigationBar from "./components/NavigationBar";

import SearchResults from "./components/SearchResults";
import SearchCriteria from "./components/SearchCriteria";

import { GlobalTrendGraphFunction } from "./components/LineGraphBase";

var axios = require("axios");

const Title = () => (
    <h1>
        <b>United States Map</b>
    </h1>
);

//<Title />
//<USAMap
//customize={this.statesCustomConfig()}
//onClick={this.mapHandler}
///>

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { inCriteria: {} };
        this.searchCriteriaCallback = this.searchCriteriaCallback.bind(this);
    }

    /* mandatory */
    mapHandler = (event) => {
        var state_name = event.target.textContent.replace(" ", "%20");

        var url = `https://disease.sh/v3/covid-19/states/${state_name}`;
        console.log(
            `getting information for the state: ${event.target.textContent}`
        );
        axios
            .get(url)
            .then(function (response) {
                console.log(response);
                var message = `State: ${
                    response.data.state
                }\nCases: ${numberWithCommas(response.data.cases)}`;
                swal("hello world!", {
                    buttons: {
                        cancel: "Close",
                    },
                    text: message,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        //alert(event.target.dataset.name);
    };

    /* optional customization of filling per state and calling custom callbacks per state */
    statesCustomConfig = () => {
        return {
            NJ: {
                fill: "navy",
                clickHandler: (event) =>
                    console.log("Custom handler for NJ", event.target.dataset),
            },
            NY: {
                fill: "#CC0000",
            },
        };
    };

    searchCriteriaCallback(criteria) {
        console.log("searchCriteriaCallback =>\n");
        console.log(criteria);
        this.setState({ inCriteria: criteria });
    }

    render() {
        return (
            <div className="App">
                <GlobalTrendGraphFunction />
                <LeftHandSide />
                <BarGraph />
                <USAMap
                    customize={this.statesCustomConfig()}
                    onClick={this.mapHandler}
                />

                <SearchCriteria cbFunc={this.searchCriteriaCallback} />

                {Object.keys(this.state.inCriteria).length !== 0 ? (
                    <SearchResults criteria={this.state.inCriteria} />
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default App;
