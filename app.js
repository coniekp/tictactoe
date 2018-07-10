var states = {
  board: [['','',''],['','',''],['','','']],
  selectedSquare: null,
  currentSign: 'X',
  gameover: false,
  gravityEnabled: false,
  rotationEnabled: false,
};

var utils = { 
 
  handleClick: (e) => {
    if(!states.gameover){
      utils.updateBoard(e.srcElement.id);
    }
  },
  
  toggleGravity: () => {
    states.gravityEnabled = !states.gravityEnabled;
    if (states.gravityEnabled) {
      view.renderGravityMode();
    } else {
      view.renderNoGravityMode();
    }
  },  
  
  toggleRotation: () => {
    states.rotationEnabled = !states.rotationEnabled;
    if (states.rotationEnabled) {
      view.renderRotationMode();
    } else {
      view.renderNoRotationMode();
    }
  },
  
  updateBoard: (id, cb) => {
    view.clearMessage();
    
    var row = parseInt(id[0]);
    var col = parseInt(id[1]);

    if (!states.board[row][col]){
      states.board[row][col] = states.currentSign;
      view.renderMove (id, states.currentSign);
      if(states.gravityEnabled){
        setTimeout(utils.addLeftGravity, 500);
      }
      if (states.rotationEnabled){
        setTimeout(utils.rotateBoard, 1000);
      }
      setTimeout(utils.checkBoardForWin, 1500);
    } else {
      view.renderWarning();
    }
  },
  
  checkBoardForWin: () => {  
    var sign = states.currentSign;
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
  
  rotateBoard: () => {
    var newBoard = [];
    states.board.forEach((row, i) => {
      var newColumn = [];
      row.forEach((square, j) => {
        newColumn.push(states.board[j][2-i]);
      });
      newBoard.push(newColumn);
    });
    states.board = newBoard;
    view.renderBoard();
  },
  
  addLeftGravity: () => {
    states.board = states.board.map((row, i) => {
      var newRow = row.join('').split('');
      while (newRow.length < 3) {
        newRow.push('');
      }
      return newRow;
    });
    view.renderBoard();
  },
  
  handleEndGame: (sign) => {
    states.gameover = true;
    view.renderGameEndMessage(sign);
  }
};

var view = {
  reset: () => window.location.reload(),
  renderSquare: (rowIndex, colIndex) => {
      var sign = states.board[rowIndex][colIndex];
      var el = document.createElement('div');
      el.setAttribute('class', 'square');
      el.setAttribute('id', '' + rowIndex + colIndex);
      el.addEventListener('click', utils.handleClick);
      el.innerText = sign;
      el.style.color = sign === 'X'? '#ed6749' : '#49c9ed';
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
  renderBoard: () => {
    var boardEl = document.getElementById('board');
    boardEl.innerHTML = ''; 
    for (var i = 0; i < 3; i++) {
      var rowEl = view.renderRow(i);
      boardEl.appendChild(rowEl);
    }
    return boardEl;
  },
  renderMove: (squareId, sign) => {
    var color = sign === 'X'? '#ed6749' : '#49c9ed';
    var squareEl = document.getElementById(squareId)
    squareEl.innerText = sign;
    squareEl.style.color = color;
  },
  setMessageBoxStyle: (visibility, text, color) =>{
    var messageBox = document.getElementById('message');
    messageBox.innerText = text;
    messageBox.style.background = color;
    messageBox.style.visibility = visibility;
  },
  renderWarning: () => {
    var text = `- INVALID MOVE -\nTRY AGAIN!`;
    view.setMessageBoxStyle('visible', text, '#ed806d');
  },
  renderGameEndMessage: (sign) => {
    var text = sign + ' WINS!';
    view.setMessageBoxStyle('visible', text, '#ffce1e');
  },
  clearMessage: ()=>{
    view.setMessageBoxStyle('hidden', '', 'white');
  },
  renderGravityMode: ()=>{
    var buttonEl = document.getElementById('gravity-button');
    buttonEl.style.background = '#112544';
  },
  renderNoGravityMode: ()=>{
    var buttonEl = document.getElementById('gravity-button');
    buttonEl.style.background = '#ccced1';
  },
  renderRotationMode: ()=>{
    var buttonEl = document.getElementById('rotation-button');
    buttonEl.style.background = '#112544';
  },
  renderNoRotationMode: ()=>{
    var buttonEl = document.getElementById('rotation-button');
    buttonEl.style.background = '#ccced1';
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  
  view.renderBoard();

});
