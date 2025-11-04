import Loader from "container/Loader";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { VpnStore } from "./AppReducer";
import VpnOverview from "./components/overview";
import "./App.scss";

const Balancer = ({ store }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		store.injectReducer("VpnStore", VpnStore);
		setIsLoaded(true);
	}, []);

	return isLoaded ? <VpnOverview /> : <Loader />;
};

Balancer.propTypes = {
	store: PropTypes.object,
};

export default Balancer;
