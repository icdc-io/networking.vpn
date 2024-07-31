import React, { useEffect, useState } from "react";
import VpnOverview from "./components/overview";
import { Provider } from "react-redux";
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

  return (
    <Provider store={store}>
      {isLoaded ? <VpnOverview /> : <Loader active inline="centered" />}
    </Provider>
  );
};

Balancer.propTypes = {
  store: PropTypes.object,
};

export default Balancer;
