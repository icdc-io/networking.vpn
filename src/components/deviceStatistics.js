import React from 'react';
import { PropTypes } from 'prop-types';
import { longDash } from './tools';

const DeviceStatistics = ({ statisticsData, field }) => {
    return (
        <div>{statisticsData[field] || longDash}</div>
    );
};

DeviceStatistics.propTypes = {
    statisticsData: PropTypes.object,
    field: PropTypes.string
};

export default DeviceStatistics;
