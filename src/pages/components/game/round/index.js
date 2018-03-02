import React from 'react';
import PropTypes from 'prop-types';

import _chunk from 'lodash/chunk';
import _flatten from 'lodash/flatten';
import _max from 'lodash/max';
import _maxBy from 'lodash/maxBy';

import { DEALER, STARTING_NUMBER_OF_CARDS } from 'core/constants';
import { calculatePossibleScores, getHighestValidScore } from 'core/service';

import PlayerHand from './player-hand';
import DealerHand from './dealer-hand';

class Round extends React.Component {
    static propTypes = {
        round: PropTypes.number.isRequired,
        deck: PropTypes.array.isRequired,
        players: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            })
        ).isRequired,
        scores: PropTypes.object.isRequired,
        onUpdateScores: PropTypes.func.isRequired,
        onRequestCard: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialRoundState();
        this.initializeCardsForRound();
    }

    getInitialRoundState = () => ({
        turn: this.props.players.find(player => player.id !== DEALER).id,
        playerCards: this.props.players.reduce((result, player) => {
            result[player.id] = [];
            return result;
        }, {}),
        needNewRound: false
    });

    initializeCardsForRound = () => {
        // need to do this separately because onRequestCard is async
        this.props
            .onRequestCard(this.props.players.length * STARTING_NUMBER_OF_CARDS)
            .then(cards => {
                const chunkedCards = _chunk(cards, STARTING_NUMBER_OF_CARDS);
                this.setState(
                    {
                        playerCards: this.props.players.reduce((result, player, index) => {
                            result[player.id] = chunkedCards[index];
                            return result;
                        }, {})
                    },
                    this.evaluateCurrentTurn
                );
            });
    };

    requestCard = player => () => {
        this.props.onRequestCard(1).then(cards => {
            this.setState(
                prevState => ({
                    playerCards: {
                        ...prevState.playerCards,
                        [player.id]: [...prevState.playerCards[player.id], ...cards]
                    }
                }),
                this.evaluateCurrentTurn
            );
        });
    };

    evaluateCurrentTurn = () => {
        const { turn, playerCards } = this.state;

        const scores = calculatePossibleScores(playerCards[turn]);
        if (scores.find(score => score === 21)) {
            this.endRound();
        } else if (scores.find(score => score < 21)) {
            // don't need to do anything now
        } else {
            this.advanceTurn();
        }
    };

    advanceTurn = () => {
        const { players } = this.props;
        const { turn, needNewRound } = this.state;

        if (needNewRound) return;

        let nextTurnIndex = players.findIndex(player => player.id === turn) + 1;
        if (!players[nextTurnIndex]) this.endRound();
        else this.setState({ turn: players[nextTurnIndex].id });
    };

    endRound = () => {
        const { onUpdateScores, scores, players } = this.props;

        let dealerScore = getHighestValidScore(
            calculatePossibleScores(this.state.playerCards[DEALER])
        );

        let highestScoringPlayer = _maxBy(
            players.filter(player => player.id !== DEALER).map(player => ({
                id: player.id,
                score: getHighestValidScore(
                    calculatePossibleScores(this.state.playerCards[player.id])
                )
            })),
            'score'
        );

        if (highestScoringPlayer && highestScoringPlayer.score > dealerScore) {
            onUpdateScores({
                ...scores,
                [highestScoringPlayer.id]:
                    scores[highestScoringPlayer.id] + highestScoringPlayer.score === 21 ? 2 : 1
            });
        } else if (
            highestScoringPlayer &&
            highestScoringPlayer.score === dealerScore &&
            dealerScore === 21
        ) {
            onUpdateScores({
                ...scores,
                [highestScoringPlayer.id]: scores[highestScoringPlayer.id] + 1,
                [DEALER]: scores[DEALER] + 1
            });
        } else {
            onUpdateScores({
                ...scores,
                [DEALER]: scores[DEALER] + 1
            });
        }

        this.setState({ needNewRound: true, turn: undefined });
    };

    newRound = () => {
        this.setState({
            ...this.getInitialRoundState()
        });
        this.initializeCardsForRound();
    };

    getHighestPlayerScore = () => {
        const { playerCards } = this.state;
        const { players } = this.props;

        return _max(
            _flatten(
                players
                    .filter(player => player.id !== DEALER)
                    .map(player =>
                        getHighestValidScore(calculatePossibleScores(playerCards[player.id]))
                    )
            )
        );
    };

    render() {
        const { turn, needNewRound } = this.state;
        return (
            <div>
                <div className="flex-row">
                    {this.props.players
                        .filter(({ id }) => id !== DEALER)
                        .map(player => (
                            <PlayerHand
                                key={player.id}
                                isTurn={turn === player.id}
                                player={player}
                                cards={this.state.playerCards[player.id]}
                                onRequestCard={this.requestCard(player)}
                                onHold={this.advanceTurn}
                            />
                        ))}
                </div>
                <DealerHand
                    isTurn={turn === DEALER}
                    isRoundOver={needNewRound}
                    cards={this.state.playerCards[DEALER]}
                    highestPlayerScore={this.getHighestPlayerScore()}
                    onRequestCard={this.requestCard(
                        this.props.players.find(player => player.id === DEALER)
                    )}
                    onHold={this.advanceTurn}
                />

                {needNewRound ? (
                    <button
                        className="p2 h2 rounded"
                        css={{ backgroundColor: 'lightblue' }}
                        onClick={this.newRound}
                    >
                        New Round
                    </button>
                ) : null}
            </div>
        );
    }
}

export default Round;
