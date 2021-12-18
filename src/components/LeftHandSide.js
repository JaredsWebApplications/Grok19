import React, { useState, useEffect } from "react";
import calendar from "./assets/calendar-solid.png";

var axios = require("axios");

var currentDate = new Date().toLocaleString("en-us", {
    month: "long",
    year: "numeric",
    day: "numeric",
});

const ColoredLine = ({ color }) => (
    // Source : https://stackoverflow.com/a/48156940
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 3,
            width: 400,
        }}
    />
);

export function numberWithCommas(x) {
    // Source : https://stackoverflow.com/a/2901298
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function getCases(url) {
    const response = await axios.get(url);
    const number = Object.values(response.data.timeline.cases)[0];
    return numberWithCommas(number);
}

// https://disease.sh/v3/covid-19/historical/US?lastdays=1

const Title = () => {
    return <h1>COVID 19 Analytics</h1>;
};

const CalendarGlyph = () => (
    <div>
        <img src={calendar} />
    </div>
);

const DatePortion = () => (
    <div>
        <CalendarGlyph />
        <h1>{currentDate}</h1>
    </div>
);
const COVIDCases = ({ count }) => (
    <div>
        <h1>
            United States COVID-19 Cases
            <h2>{count}</h2>
            <h2>Select a View</h2>
        </h1>
    </div>
);

const Body = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // set loading to true before calling API
                setLoading(true);
                const data = await getCases(
                    "https://disease.sh/v3/covid-19/historical/US?lastdays=1"
                );
                console.log(data);
                setData(data);
                // switch loading to false after fetch is complete
                setLoading(false);
            } catch (error) {
                // add error handling here
                setLoading(false);
                console.log(error);
            }
        })();
    }, []);

    if (loading) return <span>Loading</span>;

    // data will be null when fetch call fails
    if (!data) return <span>Data not available</span>;

    return (
        <div>
            <Title />
            <DatePortion />
            <COVIDCases count={data} />
        </div>
    );
};

export default function LeftHandSide() {
    return (
        <div>
            <Body />
        </div>
    );
}
