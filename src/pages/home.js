import React from 'react';
import PropTypes from 'prop-types';

import deck from 'core/data/deck.json';
import Game from './components/game';

import { DEALER } from 'core/constants';

class Home extends React.Component {
    static propTypes = {};

    state = { players: [{ id: 'player1', name: 'Will' }, { id: DEALER, name: 'Dealer' }] };

    render() {
        return (
            <div className="p2" css={{ maxWidth: 1100, margin: 'auto' }}>
                <h1 className="mt0">Blackjack</h1>
                <Game deck={deck} players={this.state.players} />
            </div>
        );
    }
}

export default Home;
