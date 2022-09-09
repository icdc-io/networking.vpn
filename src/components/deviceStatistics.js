import React from "react";
import { PropTypes } from "prop-types";
import { longDash } from "./tools";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const DeviceStatistics = ({ statisticsData, field, t }) => {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
        animations: "none"
    };

    const labels = ["", "", "", "", "", "", "", "", ""];

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                data: statisticsData && statisticsData[field],
                borderColor: "red",
                borderWidth: 2,
                backgroundColor: "#FFEBE5",
                pointRadius: 0,
            },
        ],
    };

    return (
        <div className="device-statistics-component">
            <p>{(statisticsData && statisticsData[field].length > 0) ? `${statisticsData[field][statisticsData[field].length - 1]} ${t('speed')}` : longDash}</p>
            <Line options={options} data={data} />
        </div>
    );
};

DeviceStatistics.propTypes = {
    statisticsData: PropTypes.object,
    field: PropTypes.string,
};

export default DeviceStatistics;
