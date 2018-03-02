import React from 'react';
import PropTypes from 'prop-types';

class Scores extends React.Component {
    static propTypes = {
        players: PropTypes.array.isRequired,
        scores: PropTypes.object.isRequired
    };

    render() {
        return (
            <div>
                <h2>Scores</h2>
                {this.props.players.map(player => (
                    <div key={player.id}>
                        {player.name}: {this.props.scores[player.id]}
                    </div>
                ))}
            </div>
        );
    }
}

export default Scores;
