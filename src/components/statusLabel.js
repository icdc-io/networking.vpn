import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import messages from '../Messages';

const StatusLabel = ({ intl, active }) => {
    return (
        <div className={active ? 'status-label green-text' : 'status-label gray-text'}>
            {active ? intl.formatMessage(messages.enabled) : intl.formatMessage(messages.disabled)}
        </div>
    );
};

StatusLabel.propTypes = {
    intl: PropTypes.any,
    active: PropTypes.bool
};

export default injectIntl(StatusLabel);
