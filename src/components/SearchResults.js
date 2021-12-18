import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { numberWithCommas, titleCase } from "../helper/conversion";

import LineGraphBase from "./LineGraphBase";
var axios = require("axios");

class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.results = [];
        this.current_state_used = "";
        this.date = "";
        this.state = { rows: [] };
        this.did_fetch = false;

        this.fetchData = this.fetchData.bind(this);
        this.getDaysSinceCurrentDate = this.getDaysSinceCurrentDate.bind(this);
        this.insertResult = this.insertResult.bind(this);
    }

    componentDidMount() {
        this.results = [];
    }

    componentWillReceiveProps(nextProps) {
        this.results = [];
        this.fetchData(nextProps.criteria);
    }

    insertResult(criteria, elem) {
        var date = new Date(criteria.inDate).toLocaleDateString();
        // fix year
        date =
            date.substring(0, date.length - 4) +
            date.substring(date.length - 2, date.length);

        //console.log(date);
        //console.log(elem.timeline.cases);

        this.results.push({
            state: elem.province,
            county: elem.county,
            cases: elem.timeline.cases[date],
            deaths: elem.timeline.deaths[date],
        });
    }

    fetchData(criteria) {
        this.current_state_used = criteria.inState;
        console.log(this.current_state_used);
        this.date = new Date(criteria.inDate).toLocaleDateString();
        // NOTE: Only getting data from yesterday. Setting lastdays > 1 will mean more oncoming data, therefore heavier load / longer wait.
        var url = `https://disease.sh/v3/covid-19/historical/usacounties/${criteria.inState.toLowerCase()}?lastdays=3`;

        (async () => {
            axios.get(url).then(
                function (response) {
                    response.data.map((elem) => {
                        if (criteria.inCounty.length !== 0) {
                            if (
                                criteria.inCounty.toLowerCase() === elem.county
                            ) {
                                console.log("matches county");
                                this.insertResult(criteria, elem);
                            }
                        } else {
                            console.log("matches all");
                            this.insertResult(criteria, elem);
                        }
                    });

                    this.setState({ rows: this.results });

                    window.scrollBy(0, 400);
                }.bind(this)
            );
        })();
    }

    // https://stackoverflow.com/questions/12986068/how-to-calculate-number-of-days-between-today-and-given-date-and-code-for-gettim
    getDaysSinceCurrentDate(date) {
        var today = new Date();
        var date_to_reply = new Date(date);
        var timeinmilisec = date_to_reply.getTime() - today.getTime();
        return Math.abs(Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24)));
    }

    renderRows() {
        if (!this.did_fetch) {
            this.fetchData(this.props.criteria);
            this.did_fetch = true;
        }
        const rows = this.state.rows;
        return rows.map((elem) => {
            return (
                <tr>
                    <td>{titleCase(elem.state)}</td>
                    <td>{titleCase(elem.county)}</td>
                    <td>{numberWithCommas(elem.cases)}</td>
                    <td>{numberWithCommas(elem.deaths)}</td>
                </tr>
            );
        });
    }

    render() {
        return (
            <div className="search-results">
                <br />
                <p>Cases since {this.date}</p>
                <table
                    className="table"
                    style={{
                        width: "600px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">State</th>
                            <th scope="col">County</th>
                            <th scope="col">Cases</th>
                            <th scope="col">Deaths</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderRows()}</tbody>
                </table>
                <LineGraphBase state={this.current_state_used} />
            </div>
        );
    }
}

export default SearchResults;
