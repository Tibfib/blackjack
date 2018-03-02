import React from 'react';
import PropTypes from 'prop-types';

class Deck extends React.Component {
    static propTypes = {
        deck: PropTypes.array.isRequired
    };

    render() {
        return (
            <div>
                <h2 className="mt0">Cards in Deck</h2>
                {this.props.deck.length}
            </div>
        );
    }
}

export default Deck;
