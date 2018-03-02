import React from 'react';
import PropTypes from 'prop-types';

const Backdrop = ({ isTurn, children }) => {
    return (
        <div
            css={{ backgroundColor: isTurn ? 'rgba(0,20,250,0.5)' : 'silver' }}
            className="rounded p1 mb2"
        >
            {children}
        </div>
    );
};
Backdrop.propTypes = {
    isTurn: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
};

export default Backdrop;
