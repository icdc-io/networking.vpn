import React, { useEffect } from 'react';
import VpnOverview from './components/overview';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { VpnStore } from './AppReducer';
import './App.scss';

const Balancer = ({ t, store }) => {
  useEffect(() => {
    store.injectReducer('VpnStore', VpnStore);
  }, []);

  return <Provider store={store}>
    <Router>
      <VpnOverview t={t} />
    </Router>
  </Provider>;
};

export default Balancer;
