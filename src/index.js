import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const uniqid = require('uniqid');

function Square(props) {
  return (
    <button
      className={'square ' + (props.isWinning ? 'win' : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinning={this.props.winningSquares.includes(i)}
        key={uniqid()}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  createGrid = () => {
    let grid = [];
    let i = 0;

    //   Outer Loop to create parent Rows
    for (let x = 0; x < 3; x++) {
      let children = [];

      // Inner loop to create children
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(i));
        i += 1;
      }
      // Create Parent and Add children
      grid.push(
        <div key={uniqid()} className=' board-row '>
          {children}
        </div>
      );
    }
    return grid;
  };

  render() {
    return <div>{this.createGrid()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moveCoords: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moveCoords = squareCoords(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([
        {
          squares: squares,
          moveCoords: moveCoords
        }
      ]),
      stepNumber: history.length,
      squares: squares,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  toggleSortList() {
    this.setState({
      isDescending: !this.state.isDescending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const boardFilled = this.state.stepNumber === 9 ? true : null;
    // For better method than boardFilled refer to line
    // 141
    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' +
          move +
          ' at position: (' +
          step.moveCoords[0] +
          ', ' +
          step.moveCoords[1] +
          ')'
        : 'Go to game start';

      return (
        <li key={move}>
          <button
            className={step === current ? 'active' : null}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      console.log('winner', winner);
      status = 'Winner: ' + winner.player + ' at ' + winner.line;
    } else if (boardFilled) {
      // A Better way is to remove"boardFilled" and insert
      // (!current.squares.includes(null)
      //  this just means, "if all squares that move do not include null")
      status = 'DRAW! Please Go to Game Start';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className=' game '>
        <div className=' game-board '>
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className=' game-info '>
          <div>{status}</div>
          <button onClick={() => this.toggleSortList()}>
            Sort By: {this.state.isDescending ? 'Descending' : 'Ascending'}
          </button>
          <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function squareCoords(currentSquare) {
  let col = (currentSquare % 3) + 1;
  let row;
  if (currentSquare < 3) {
    row = 1;
  } else if (currentSquare > 2 && currentSquare < 6) {
    row = 2;
  } else {
    row = 3;
  }

  return [col, row];
}
