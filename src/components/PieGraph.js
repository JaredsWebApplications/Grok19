import "./PieGraph.css";
import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

var axios = require("axios");

// endpoint : https://disease.sh/v3/covid-19/states?sort=deaths

async function getStateInformation(url) {
    const response = await axios.get(url);
    var container = [];
    response.data.slice(0, 11).forEach((element) => {
        var payload = {
            state: element.state,
            todayDeaths: element.todayDeaths,
        };
        container.push(payload);
    });
    return container;
}

export default function PieGraph() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // set loading to true before calling API
                setLoading(true);
                const data = await getStateInformation(
                    "https://disease.sh/v3/covid-19/states?sort=deaths"
                );
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
    if (!data) return <span>Data not available for a Pie Chart</span>;
    console.log(data);
    return (
        <div>
            <BarChart
                width={1200}
                height={300}
                data={data}
                layout="horizontal"
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="todayDeaths" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="todayCases" fill="#82ca9d" />
            </BarChart>
            <b>Top 10 Highest States</b>
        </div>
    );
}
