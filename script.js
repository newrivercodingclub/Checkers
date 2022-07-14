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

const tileWidth = 90;
const canvasSize = 720
// index(14) (14 % 8) = 6

//a utility class to reference the current canvas' context
class Canvas{
    constructor(){
        this.canvas = document.getElementById('board')
        this.canvas.height = canvasSize
        this.canvas.width = canvasSize
        this.ctx = this.canvas.getContext('2d')
    }
}

const canvas = new Canvas();

//return the alternate color to a given argument (white => black)
function color_iterator(color) {
  return color == "white" ? "black" : "white";
}

//draw alternating color squares with dimensions 90x90
function draw_board(x, y, color = "white") {
  if (x < 720) {
    const new_color = color_iterator(color);
    canvas.ctx.fillStyle = new_color;
    canvas.ctx.fillRect(x, y, tileWidth, tileWidth);
    const new_x = x + tileWidth;
    draw_board(new_x, y, new_color);
  }
  else if( x >= 720 && y < 720) {
    const new_x = 0;
    const new_y = y + tileWidth;
    const new_color = color_iterator(color);
    draw_board(new_x, new_y, new_color);
  }
}

//sort the board into a objects of tiles coordinates and their index
const tile_to_coord = (tile, index) => {
    const x = tile % 8
    const y = Math.floor(tile / 8)
    const value = tile
    return {x: x, y: y, value: value, index: index}
}
const tiles = board.map((value, index) => tile_to_coord(value, index));
//filter out any tiles that don't contain a piece
const active_tiles = tiles.filter((obj) => obj.value > 0);

function draw_pieces(){
    
    
}

draw_board(0, 0);
draw_pieces(0, 0, "blue")