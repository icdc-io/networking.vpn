import React from 'react';
import PropTypes from 'prop-types';

const StatusLabel = ({ t, active }) => {
    return (
        <div className={active ? 'status-label green-text' : 'status-label gray-text'}>
            {active ? t('enabled') : t('disabled')}
        </div>
    );
};

StatusLabel.propTypes = {
    t: PropTypes.func,
    active: PropTypes.bool
};

export default StatusLabel;
