import React from 'react';
import PropTypes from 'prop-types';
import _shuffle from 'lodash/shuffle';

import Round from './round';
import Deck from './deck';
import Scores from './scores';

class Game extends React.Component {
    static propTypes = {
        deck: PropTypes.arrayOf(
            PropTypes.shape({
                code: PropTypes.string.isRequired,
                suit: PropTypes.oneOf(['DIAMONDS', 'SPADES', 'HEARTS', 'CLUBS']).isRequired,
                value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
                    .isRequired,
                image: PropTypes.string.isRequired
            })
        ),
        players: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            })
        ).isRequired
    };

    getInitialGameState = () => ({
        cardsInDeck: _shuffle(this.props.deck),
        scores: this.props.players.reduce((result, player) => {
            result[player.id] = 0;
            return result;
        }, {}),
        round: 1
    });

    state = this.getInitialGameState();

    handleRequestCard = (number = 1) => {
        return new Promise((resolve, reject) => {
            this.setState(({ cardsInDeck }) => {
                if (cardsInDeck.length >= number) {
                    resolve(cardsInDeck.slice(-number));
                    return {
                        cardsInDeck: cardsInDeck.slice(0, cardsInDeck.length - number)
                    };
                } else {
                    reject(new Error('No cards left'));
                    return null;
                }
            });
        });
    };

    handleUpdateScores = newScores => this.setState({ scores: newScores });

    render() {
        const { players } = this.props;
        const { scores, round, cardsInDeck } = this.state;
        return (
            <div className="flex">
                <div className="col col-8">
                    <Round
                        round={round}
                        players={players}
                        deck={cardsInDeck}
                        onRequestCard={this.handleRequestCard}
                        scores={scores}
                        onUpdateScores={this.handleUpdateScores}
                    />
                </div>
                <div className="col col-4 pl2">
                    <Deck deck={cardsInDeck} />
                    <Scores players={players} scores={this.state.scores} />
                </div>
            </div>
        );
    }
}

export default Game;
