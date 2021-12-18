import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
var axios = require("axios");

async function obtainData() {
    const response = await axios.get(
        "https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=all"
    );
    return response.data;
}

export const GlobalTrendGraphFunction = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // set loading to true before calling API
                setLoading(true);
                const data = await obtainData();
                console.log(data);
                console.log("HELLO MOM I MADE IT");
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

    // return a Spinner when loading is true
    if (loading) return <span>Loading</span>;

    // data will be null when fetch call fails
    if (!data) return <span>Data not available</span>;

    let series = [
        {
            name: "Global Cases",
            // amount of cases
            data: Object.values(data.cases),
        },
    ];
    let options = {
        chart: {
            height: 350,
            type: "line",
            zoom: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight",
        },
        title: {
            text: "Global COVID Trend Since Epoch",
            align: "left",
        },
        grid: {
            row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        xaxis: {
            // dates
            categories: Object.keys(data.cases),
        },
    };

    return (
        <div id="chart">
            <ReactApexChart
                options={options}
                series={series}
                type="line"
                height={350}
            />
        </div>
    );
};
