import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ name, hide, image, height, width }) => {
    return hide ? (
        <div
            css={{
                height,
                width,
                backgroundColor: 'green',
                borderRadius: 5,
                margin: 5,
                display: 'inline-block'
            }}
        />
    ) : (
        <img src={image} alt={name} css={{ margin: 5, height, width }} />
    );
};

Card.defaultProps = {
    height: 140,
    width: 100
};
Card.propTypes = {
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    suit: PropTypes.oneOf(['DIAMONDS', 'SPADES', 'HEARTS', 'CLUBS']).isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
    image: PropTypes.string.isRequired,
    //
    height: PropTypes.number,
    width: PropTypes.number
};

export default Card;
