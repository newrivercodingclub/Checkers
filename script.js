/*

01010101/
10101010/
01010101/
00000000/
00000000/
20202020/
02020202/
20202020/



1's move additive in a single array
2's move subtractive in a single array
3's and 4's are kings and can move additive and subtractive, but must have their own checksums for enemy on jump

when 1's hit last 8 (55-63) array slot upgrades to 3, when 2's hit first 8 (0-7) slots upgrades to 4
forced move when take a peice take is available, if more than one legal forced take, user chooses move. 

legal moves:
space is in legal move sub array
space is unoccupied
space does not wrap board

taking piece:
+7 or +9 array addition, is occupied by enemy piece check? if yes +7 or +9 (respectivly) again, is legal landing location check(not off board, not occupied). Take piece off board move to 2nd iteration location.

*/

// function board_move(incoming_index, outbound_index, player){
//     incoming_index = 0
//     //do math to figure out what the piece will move over
//     if piece moves over oponent's piece -> index of oponents piece = 0
//     outbound_index = if_player1_1_or_player2_2
// }

let board = [
  0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2,
  0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0,
];

let legalBoard = [1, 3, 5, 7, 8, 10, 12, 14];

// index(14) (14 % 8) = 6

class Canvas {
  constructor() {
    this.canvas = document.getElementById("board");
    this.ctx = this.canvas.getContext("2d");
  }
}

let tileWidth = 90;

function color_iterator(color) {
  return "white" ? "black" : "black";
}

function draw_board(index_x, index_y, color = "black") {
  console.log("hello");
  if (index_x < 720) {
    let new_color = color_iterator(color);
    Canvas.ctx.fillStyle = new_color;
    Canvas.ctx.fillRect(index_x, index_y, tileWidth, tileWidth);
    let new_x = index_x + tileWidth;
    draw_board(new_x, index_y, new_color);
  } else {
    let new_x = 0;
    let new_y = index_y + tileWidth;
    let new_color = color_iterator(color);
    draw_board(new_x, new_y, new_color);
  }
}

draw_board(0, 0);
