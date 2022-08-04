import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return (
    <button
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winningLine = this.props.winLine;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        highlight={winningLine && winningLine.includes(i)}
      />
    );
  }

  render() {
    // using two loops instead of hardcoding the squares
    let divBlock = [];

    for (let i = 0; i < 3; i++) {
      let rows = [];
      for (let j = 0; j < 3; j++) {
        const rowNumber = j + (i * 3);
        rows.push(this.renderSquare(rowNumber));
      }
      divBlock.push(<div key={i} className="board-row">{rows}</div>);
    }

    console.log(divBlock)

    return (
      <div>{divBlock}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastSquareClicked: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastSquareClicked: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winInfo = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      console.log(move);
      console.log(step);
      const col = step.lastSquareClicked % 3;
      const row = Math.floor(step.lastSquareClicked / 3);

      if (move === this.state.stepNumber) {
        console.log(move + " " + this.state.stepNumber);
      }

      const description = move ?
        `Go to move #${move} (${col}, ${row})` :
        'Go to game start';

      return (
        <li key={move}>
          <button
            id={move === this.state.stepNumber ? "bold-button" : ""}
            className="button-nice"
            onClick={() => this.jumpTo(move)}>{description}</button>
        </li >
      );

    });

    let status;
    let gameFinished = '';
    if (winInfo.winner) {
      status = 'Winner: ' + winInfo.winner;
      gameFinished = 'game-finished';
    } else if (winInfo.isDraw) {
      status = "Draw";
      gameFinished = 'game-finished';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <div className="game-info">
          </div>
          <div className="board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winLine={winInfo.line}
            />
          </div>
          <div className="game-info">
            <div
              className='status'
              id={gameFinished}
            >
              {status}
            </div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) { // first condition is a check for non-null
      return {
        winner: squares[a],
        isDraw: false,
        line: lines[i],
      }
    }
  }

  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      isDraw = false;
      break;
    }
  }

  return {
    winner: null,
    isDraw: isDraw,
  };
}
