document.addEventListener("DOMContentLoaded", (event) =>{
  
  var board = [['','',''],['','',''],['','','']];
  var selectedSquare;
  var currentSign = 'X';
  var gameover = false;  
  reset = () => {
    window.location.reload();
  }
  handleClick = (e) =>{
    if(!gameover){
      var squareId = e.srcElement.id;
      changeSignInSquare(squareId);
      checkBoardForWin(currentSign);
    }
  };
  
  changeSignInSquare = (id) => {
    var row = parseInt(id[0]);
    var col = parseInt(id[1]);

    if (!board[row][col]){
      board[row][col] = currentSign;
      renderSign (id, currentSign);
    } else {
      return alert("Invalid Move. Try again!");
    }
  };
  
  renderSign = (id, sign) => {
    document.getElementById(id).innerText = sign;
  };
  
  checkBoardForWin = (sign) => {
    if (find3inRow(sign) || find3inColumn(sign) || find3inDiagonal(sign)) {
      handleEndGame (currentSign);
    } else {
      currentSign = currentSign === 'X'? 'O' : 'X';
    }
    
  };
  
  find3inRow = (sign) => {
    return board.some((row) => {
      return row.every ((square) => {
        return square === sign;
      });
    });
  };
  
  find3inColumn = (sign) => {
    return board[0].some((val, index) => {
      return val === sign && board[1][index] === sign && board[2][index] === sign; 
    });
  };
  
  find3inDiagonal = (sign) => {
    var majorDiagonalWin = board.every((row, index) => {
      return row[index] === sign;
    });
    
    var minorDiagonalWin = board.every((row, index) => {
      return row[2-index] === sign;
    });
    
    return majorDiagonalWin || minorDiagonalWin;
  };
  
  handleEndGame = (sign) => {
    document.getElementById('message').innerText = sign + ' WINS!';
    gameover = true;
  };
  
  
  
});
