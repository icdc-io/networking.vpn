import React, { useEffect, useState } from "react";
import VpnOverview from "./components/overview";
import { VpnStore } from "./AppReducer";
import { Loader } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./App.scss";

const Balancer = ({ store }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    store.injectReducer("VpnStore", VpnStore);
    setIsLoaded(true);
  }, []);

  return isLoaded ? <VpnOverview /> : <Loader active inline="centered" />;
};

Balancer.propTypes = {
  store: PropTypes.object,
};

export default Balancer;
