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
    //view.clearMessage();
    
    var row = parseInt(id[0]);
    var col = parseInt(id[1]);

    if (!states.board[row][col]){
      states.board[row][col] = states.currentSign;
      view.renderMove (id, states.currentSign); //1. show the player new move
      
      if(states.gravityEnabled){                //2. if left gravity is enabled, shift the signs left 
        setTimeout(utils.addLeftGravity, 200);
      }
      
      if (states.rotationEnabled){            //3. if rotation is enabled, shift the signs left 
        setTimeout(utils.rotateBoard, 600);
      }
      setTimeout(utils.checkBoardForWin, 650); //4. check for wins after effects have been applied
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
      view.signalTurn();
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
  setMessageBoxStyle: (textColor, text, backgroundColor) =>{
    var messageBox = document.getElementById('message');
    messageBox.innerText = text;
    messageBox.style.background = backgroundColor;
    messageBox.style.color = textColor;
  },
  renderWarning: () => {
    var text = `- INVALID MOVE -\nTRY AGAIN!`;
    view.setMessageBoxStyle('#fff', text, '#ed806d');
  },
  signalTurn: () => {
    if (states.currentSign === 'X') {
      view.setMessageBoxStyle('#ed6749', 'PLAYER 1 GO!', '#fff');
    } else {
      view.setMessageBoxStyle('#49c9ed', 'PLAYER 2 GO!', '#fff');
    }
  },
  renderGameEndMessage: (sign) => {
    var text = sign + ' WINS!';
    view.setMessageBoxStyle('#fff', text, '#ffce1e');
  },
  clearMessage: ()=>{
    view.setMessageBoxStyle('#fff', '', 'white');
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
