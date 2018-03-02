import React from 'react';
import PropTypes from 'prop-types';

import { calculatePossibleScores } from 'core/service';

const CardScores = ({ cards }) => {
    return calculatePossibleScores(cards).map(score => (
        <span key={score} css={{ textDecoration: score > 21 ? 'line-through' : undefined }}>
            {score}{' '}
        </span>
    ));
};
CardScores.propTypes = {
    cards: PropTypes.array.isRequired
};

export default CardScores;
