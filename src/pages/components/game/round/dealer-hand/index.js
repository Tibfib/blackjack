import React from 'react';
import PropTypes from 'prop-types';

import Card from 'core/components/Card';
import Backdrop from 'core/components/Backdrop';
import CardScores from 'core/components/CardScores';

import { calculatePossibleScores } from 'core/service';

class DealerHand extends React.Component {
    static propTypes = {
        cards: PropTypes.array.isRequired,
        isTurn: PropTypes.bool.isRequired,
        isRoundOver: PropTypes.bool.isRequired,
        onRequestCard: PropTypes.func.isRequired,
        onHold: PropTypes.func.isRequired,
        highestPlayerScore: PropTypes.number.isRequired
    };

    componentWillReceiveProps(nextProps) {
        setTimeout(this.act, 600);
    }

    act = () => {
        if (this.props.isTurn) {
            let scores = calculatePossibleScores(this.props.cards);
            if (scores.find(score => score >= this.props.highestPlayerScore)) {
                this.props.onHold();
            } else {
                this.props.onRequestCard();
            }
        }
    };

    render() {
        const { cards, isTurn, isRoundOver } = this.props;
        return (
            <Backdrop isTurn={isTurn}>
                <div className="flex">
                    <div className="flex-auto">
                        {' '}
                        <h3 className="my0">Dealer</h3>
                    </div>
                    {isTurn || isRoundOver ? (
                        <div>
                            Score: <CardScores cards={cards} />
                        </div>
                    ) : null}
                </div>
                <div>
                    {cards.map((card, index) => (
                        <Card
                            hide={!isTurn && !isRoundOver && index === 0}
                            key={card.code}
                            {...card}
                        />
                    ))}
                </div>
            </Backdrop>
        );
    }
}

export default DealerHand;
