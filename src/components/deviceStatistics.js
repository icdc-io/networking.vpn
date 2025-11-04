import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { PropTypes } from "prop-types";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { longDash } from "./tools";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
);

const DeviceStatistics = ({ statisticsData, field }) => {
	const { t } = useTranslation();
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
		animations: "none",
	};

	const labels = ["", "", "", "", "", "", "", "", ""];

	const data = {
		labels,
		datasets: [
			{
				fill: true,
				data: statisticsData?.[field],
				borderColor: "red",
				borderWidth: 2,
				backgroundColor: "#FFEBE5",
				pointRadius: 0,
			},
		],
	};

	return (
		<div className="device-statistics-component">
			<p>
				{statisticsData && statisticsData[field].length > 0
					? `${statisticsData[field][statisticsData[field].length - 1]} ${t("speed")}`
					: longDash}
			</p>
			<Line options={options} data={data} />
		</div>
	);
};

DeviceStatistics.propTypes = {
	statisticsData: PropTypes.object,
	field: PropTypes.string,
};

export default DeviceStatistics;
