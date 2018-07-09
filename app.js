document.addEventListener("DOMContentLoaded", (event) =>{
  
  var boardEl = document.getElementById('board');
  
  
  var board = [['_','_','_'],['_','_','_'],['_','_','_']];
  
  var selectedSquare;
  
  handleClick = (e) =>{
    var squareId = e.srcElement.id;
    changeSignInSquare(squareId);
  };
  
  changeSignInSquare = (id) => {
    var row = parseInt(id[0]);
    var col = parseInt(id[1]);

    if (board[row][col] === '_') {
      board[row][col] = 'X';
    } else {
      board[row][col] = '_';
    }
    console.log(board[row][col]);
  }
});
