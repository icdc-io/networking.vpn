import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { VpnStore } from "./AppReducer";
import VpnOverview from "./components/overview";
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
