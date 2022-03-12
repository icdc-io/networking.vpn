import React, { useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';

const VpnCopyButton = ({ copiedContent }) => {
    const [trigger, setTrigger] = useState(false);

    const returnCopyIcon = () => setTimeout(() => setTrigger(false), 1000);

    const copy = () => {
      navigator.clipboard.writeText(copiedContent);
      setTrigger(!trigger);
      returnCopyIcon();
    };

    return (
      <Button icon className='copy-popup-button' style={{ background: 'transparent', padding: '0px' }} onClick={copy}>
          <Icon name={trigger ? 'check' : 'copy'} inverted />
      </Button>
    );
};

VpnCopyButton.propTypes = {
  copiedContent: PropTypes.string
};

export default VpnCopyButton;
