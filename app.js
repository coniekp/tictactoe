var states = {
  board: [['','',''],['','',''],['','','']],
  selectedSquare: null,
  currentSign: 'X',
  gameover: false
};

var utils = { 
 
  handleClick: (e) => {
    if(!states.gameover){
      utils.updateBoard(e.srcElement.id);
      utils.checkBoardForWin(states.currentSign);
    }
  },
  
  updateBoard: (id) => {
    view.clearMessage();
    
    var row = parseInt(id[0]);
    var col = parseInt(id[1]);

    if (!states.board[row][col]){
      states.board[row][col] = states.currentSign;
      view.renderMove (id, states.currentSign);
    } else {
      view.renderWarning();
    }
  },
  
  checkBoardForWin: (sign) => {
    var hasWinningCombo = utils.find3InARow.some((finder) => finder(sign));
    if (hasWinningCombo) {
      utils.handleEndGame (states.currentSign);
    } else {
      states.currentSign = states.currentSign === 'X'? 'O' : 'X';
    }
  },
  
  find3InARow: [
    
    findInRow = (sign) => {
      return states.board.some((row) => {
        return row.every ((square) => {
          return square === sign;
        });
      });
    },
    
    findInColumn = (sign) => {
      return states.board[0].some((val, index) => {
        return val === sign && states.board[1][index] === sign && states.board[2][index] === sign; 
      });
    },
    
    findInDiagonals = (sign) => {
      var majorDiagonalWin = states.board.every((row, index) => {
        return row[index] === sign;
      });
    
      var minorDiagonalWin = states.board.every((row, index) => {
        return row[2-index] === sign;
      });
    
      return majorDiagonalWin || minorDiagonalWin;
    }
  ], 
  
  handleEndGame: (sign) => {
    states.gameover = true;
    view.renderGameEndMessage(sign);
  }
};

var view = {
  reset: () => window.location.reload(),
  renderSquare: (rowIndex, colIndex) => {
      var el = document.createElement('div');
      el.setAttribute('class', 'square');
      el.setAttribute('id', '' + rowIndex + colIndex);
      el.addEventListener('click', utils.handleClick);
      return el;
  },
  renderRow: (rowIndex) => {
    var el =  document.createElement('div');
    el.setAttribute('class', 'row');
    for (var i = 0; i < 3; i++){
      var squareEl = view.renderSquare(rowIndex, i);
      el.appendChild(squareEl);
    };
    return el;
  },
  renderBoard: (boardEl) => {
    for (var i = 0; i < 3; i++) {
      var rowEl = view.renderRow(i);
      boardEl.appendChild(rowEl);
    }
    return boardEl;
  },
  renderMove: (squareId, sign) => {
    document.getElementById(squareId).innerText = sign;
  },
  renderWarning: () => {
    document.getElementById('message').innerText = 'Invalid Move.Try again';
  },
  renderGameEndMessage: (sign) => {
    document.getElementById('message').innerText = sign + ' WINS!';
  },
  clearMessage: ()=>{
    document.getElementById('message').innerText = ''; 
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  
  var boardEl = document.getElementById('board');
  view.renderBoard(boardEl);

});
