import "./PieGraph.css";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";

var axios = require("axios");

// endpoint : https://disease.sh/v3/covid-19/states?sort=deaths

async function getStateInformation(url) {
    const response = await axios.get(url);
    var container = [];
    response.data.slice(0, 5).forEach((element) => {
        var payload = {
            state: element.state,
            todayDeaths: element.todayDeaths,
        };
        container.push(payload);
    });
    var top_five_states = response.data.slice(0, 5);
    console.log(top_five_states);
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
    if (!data) return <span>Data not available for a Pie Chart</span>;
    console.log(data);
    return (
        <div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie
                        dataKey="todayDeaths"
                        isAnimationActive={false}
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    />
                    <Pie
                        dataKey="state"
                        data={data}
                        cx={500}
                        cy={200}
                        innerRadius={40}
                        outerRadius={80}
                        fill="#82ca9d"
                    />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <b>Top Five States</b>
        </div>
    );
}
