import _isFinite from 'lodash/isFinite';
import _flatMap from 'lodash/flatMap';
import _uniq from 'lodash/uniq';
import _max from 'lodash/max';

function calculatePossibleScores(cards) {
    let forSureScore = cards
        .filter(card => _isFinite(card.value))
        .reduce((sum, card) => (sum += card.value), 0);

    let multiValueCards = cards.filter(card => !_isFinite(card.value));

    // each multivalue cards doubles the score possibilities
    let scores = _uniq(
        multiValueCards.reduce(
            (scores, card) => _flatMap(scores, score => card.value.map(value => value + score)),
            [forSureScore]
        )
    );

    return scores;
}

function getHighestValidScore(scores) {
    return _max(scores.filter(score => score <= 21)) || 0;
}

export { calculatePossibleScores, getHighestValidScore };
