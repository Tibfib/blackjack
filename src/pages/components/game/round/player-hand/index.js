import React from 'react';
import PropTypes from 'prop-types';

import Card from 'core/components/Card';
import Backdrop from 'core/components/Backdrop';
import CardScores from 'core/components/CardScores';

class PlayerHand extends React.Component {
    static propTypes = {
        isTurn: PropTypes.bool.isRequired,
        player: PropTypes.object.isRequired,
        cards: PropTypes.array.isRequired,
        onRequestCard: PropTypes.func.isRequired,
        onHold: PropTypes.func.isRequired
    };

    render() {
        const { isTurn, player, cards, onRequestCard, onHold } = this.props;
        return (
            <Backdrop isTurn={isTurn}>
                <div className="flex">
                    <h3 className="my0">{player.name}</h3>
                    <div className="flex-auto" />
                    <div>
                        Score: <CardScores cards={cards} />
                    </div>
                    <div>
                        <button
                            className="mx2"
                            type="button"
                            disabled={!isTurn}
                            onClick={isTurn ? onRequestCard : undefined}
                        >
                            Hit Me
                        </button>
                        <button
                            type="button"
                            disabled={!isTurn}
                            onClick={isTurn ? onHold : undefined}
                        >
                            Hold
                        </button>
                    </div>
                </div>
                <div>{cards.map(card => <Card key={card.code} {...card} />)}</div>
            </Backdrop>
        );
    }
}

export default PlayerHand;
