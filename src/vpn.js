import React, { useEffect } from 'react';
import VpnOverview from './components/overview';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Lang from './Lang';
import { VpnStore } from './AppReducer';
import './App.scss';

const Balancer = ({ store }) => {
  useEffect(() => {
    store.injectReducer('VpnStore', VpnStore);
  }, []);

  return <Provider store={store}>
    <Router>
      <Lang>
        <VpnOverview />
      </Lang>
    </Router>
  </Provider>;
};

export default Balancer;
