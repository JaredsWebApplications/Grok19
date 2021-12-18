import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import countryInfo from "../helper/country_info.json";

import swal from "sweetalert";

class SearchCriteria extends React.Component {
    constructor(props) {
        super(props);

        let cdate = new Date();
        this.state = {
            inState: "California",
            inCounty: "",
            inDate: this.get2DaysDateFromTodayDate(),

            states: countryInfo,
            counties: [],
            selectedState: "State",
            selectedCounty: "County",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeState = this.changeState.bind(this);
        this.changeCounty = this.changeCounty.bind(this);

        this.cbFunc = props.cbFunc;
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        //console.log(event.target.name + " => " + event.target.value);
    }

    handleSubmit(event) {
        event.preventDefault();
        //console.log(this.state.inState + "; " + this.state.inCounty + "; " + this.state.inDate);
        if (this.state.selectedState !== "State") {
            this.cbFunc(this.state);
        } else {
            swal("Must select a state.");
        }
    }

    get2DaysDateFromTodayDate() {
        const today = new Date();
        const last2Days = new Date(today);
        last2Days.setDate(last2Days.getDate() - 2);
        var result = last2Days.toISOString().split("T")[0];
        return result;
    }

    get30DaysDateFromTodayDate() {
        const today = new Date();
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        var result = last30Days.toISOString().split("T")[0];
        return result;
    }

    changeState(event) {
        if (event.target.value !== "State") {
            var selectedState = event.target.value;
            var counties = this.state.states.filter(function (v, k) {
                return v.name === selectedState;
            })[0].counties;

            this.setState({
                selectedState: selectedState,
                selectedCounty: "County",
                counties: counties,
                inState: selectedState,
                inCounty: "",
            });
        } else {
            this.setState({
                selectedState: "State",
                selectedCounty: "County",
                counties: [],
                inState: "",
                inCounty: "",
            });
        }
    }

    changeCounty(event) {
        var county = event.target.value === "County" ? "" : event.target.value;
        this.setState({
            selectedCounty: event.target.value,
            inCounty: county,
        });
    }

    render() {
        return (
            <div className="search-criteria" style={styles.background}>
                <h4>Search</h4>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label style={styles.lbl}>State</label>
                        <select
                            className="form-select"
                            placeholder="State"
                            value={this.state.selectedState}
                            onChange={this.changeState}
                        >
                            <option>State</option>
                            {this.state.states.map((info) => {
                                return (
                                    <option key={info.name}>{info.name}</option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={styles.lbl}>County</label>
                        <select
                            className="form-select"
                            placeholder="County"
                            value={this.state.selectedCounty}
                            onChange={this.changeCounty}
                        >
                            <option>County</option>
                            {this.state.counties.map((e, key) => {
                                return <option key={key}>{e}</option>;
                            })}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success"
                        style={styles.btn}
                    >
                        Search
                    </button>
                    <p>
                        <small style={styles.small}>
                            (Searches can take a few seconds before results
                            show.)
                        </small>
                    </p>
                </form>
            </div>
        );
    }
}

const styles = {
    lbl: {
        marginTop: 10,
        marginBottom: 10,
    },
    btn: {
        width: 300,
        marginTop: 20,
    },
    small: { color: "blue" },
    background: {
        backgroundColor: "#eee",
        margin: "auto",
        padding: 10,
        width: 800,
    },
};

export default SearchCriteria;
