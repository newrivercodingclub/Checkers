let board = [
  0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2,
  0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0,
];

let legalBoard = [
  1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23, 24, 26, 28, 30, 33, 35, 37, 39, 40,
  42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62,
];

const tileWidth = 90;
const canvasSize = 720;
//colors selected from https://coolors.co/palettes/trending
const colors = {
  light: "#eff6e0",
  dark: "#01161e",
  blue: "#197278",
  red: "#c44536",
  translucent_red: "rgba(196, 69, 54, 0.75)",
  translucent_blue: "rgba(25, 114, 120, 0.75)",
};

class Canvas {
  //a utility class to reference the current canvas' context
  constructor() {
    this.canvas = document.getElementById("board");
    this.canvas.height = canvasSize;
    this.canvas.width = canvasSize;
    this.ctx = this.canvas.getContext("2d");
    this.rect = this.canvas.getBoundingClientRect();
  }
}

//define the game board as a canvas object
const canvas = new Canvas();

function color_iterator(color) {
  //return the alternate color to a given argument (white <=> black)
  return color == colors.light ? colors.dark : colors.light;
}

function draw_board(x, y, color = "black") {
  //draw alternating color squares with current tile dimensions
  if (x < canvasSize) {
    const new_color = color_iterator(color);
    canvas.ctx.fillStyle = new_color;
    canvas.ctx.fillRect(x, y, tileWidth, tileWidth);
    const new_x = x + tileWidth;
    draw_board(new_x, y, new_color);
  } else if (x >= canvasSize && y < canvasSize) {
    const new_x = 0;
    const new_y = y + tileWidth;
    const new_color = color_iterator(color);
    draw_board(new_x, new_y, new_color);
  }
  if (clicked_piece != null) {
    //highlight legal moves
    const moves = (legal_moves(clicked_piece)).map((value, index) =>
      tile_to_object(value)
    );
    moves.forEach((object) => {
      canvas.ctx.beginPath();
      canvas.ctx.fillStyle = "rgba(0,255,0,0.25)";
      canvas.ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
      canvas.ctx.fill()
    });
  }
}

const tile_to_object = (index) => {
  //takes an input tile value (0,1,2,3,4) along with its index (0-63)
  //and converts it into an object to be drawn on the canvas
  const radius = (tileWidth / 2) * 0.9;
  const x = (index % 8) * tileWidth + radius * 1.1;
  const y = Math.floor(index / 8) * tileWidth + radius * 1.1;
  const value = board[index];
  const color = board[index] < 2 ? colors.blue : colors.red;
  return {
    x: x,
    y: y,
    value: value,
    index: index,
    color: color,
    radius: radius,
  };
};

function get_tiles() {
  //convert the board array into a series of objects and return them as an aray
  return board.map((value, index) => tile_to_object(index));
}

function get_active_tiles() {
  //get current tile objects
  const tiles = get_tiles();
  //return all tiles that contain a piece as an array
  return tiles.filter((obj) => obj.value > 0);
}

function draw_pieces() {
  //get active tiles (tiles with a piece currently occupying them)
  const active_tiles = get_active_tiles();
  //draw a piece onto each active tile
  active_tiles.forEach((object) => {
    canvas.ctx.beginPath();
    canvas.ctx.fillStyle = `${object.color}`;
    canvas.ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
    canvas.ctx.fill();
  });
  //if a piece is currently being dragged, draw that piece at current mouse position
  if (ghost_piece != null) {
    canvas.ctx.beginPath();
    canvas.ctx.fillStyle = `${ghost_piece.color}`;
    canvas.ctx.arc(
      ghost_piece.x,
      ghost_piece.y,
      ghost_piece.radius,
      0,
      Math.PI * 2
    );
    canvas.ctx.fill();
  }
}

function click_to_tile(click_x, click_y) {
  //returns the tile clicked (0-63) given input click cordinates
  const x = Math.floor(click_x / tileWidth);
  const y = Math.floor(click_y / tileWidth);
  console.log(x, y);
  return x + y * 8;
}

function absolute_to_relative(x, y) {
  //accept absolute position within the window
  //returns a relative position within the canvas (top left is 0,0)
  return { x: x - canvas.rect.left, y: y - canvas.rect.top };
}

function delete_piece(index) {
  board[index] = 0;
}

function to_translucent(color) {
  return color == colors.blue
    ? colors.translucent_blue
    : colors.translucent_red;
}

function is_legal(from, to) {
  //accepts from: an object describing the piece moving
  //and to: the index of the tile piece is attempting to move to
  if (legalBoard.includes(to.index)) {
    if (from.color == colors.red) {
      if (from.index > to.index) {
        if ((from.index - to.index) % 7 == 0 || (from.index - to.index) % 9 == 0) {
          return true;
        }
      }
    } else if (from.color == colors.blue) {
      if (from.index < to.index) {
        if ((to.index - from.index) % 7 == 0 || (to.index - from.index) % 9 == 0) {
          return true;
        }
      }
    } else if (from.value == 3 || from.value == 4){
      if ((to.index - from.index) % 7 == 0 || (to.index - from.index) % 9 == 0) {
        return true;
      }
    }
  } else {
    return false;
  }
}

function is_jump(to){
  if( to.value > 0){
    return [to.index]
  }
}

function legal_moves(from) {
  //TODO: if enemy piece in between valid tile and moving piece, trigger jump logic (capture piece and add move)
  
  const all_diagonals = legalBoard.filter((to) => is_legal(from, tile_to_object(to)))
  const jumped_tiles = all_diagonals.filter((to) => is_jump(tile_to_object(to)))
  const non_jumped_tiles = all_diagonals.filter((to) => !is_jump(tile_to_object(to)))
  // console.log(all_diagonals, jump_moves, single_moves)
  return non_jumped_tiles
}

//store the currently selected (moving) piece as an object
let clicked_piece = null;
let ghost_piece = null;

function pointer_down(event) {
  const relative_click = absolute_to_relative(event.x, event.y);
  const clicked_tile = click_to_tile(relative_click.x, relative_click.y);
  //store clicked piece globally
  clicked_piece = tile_to_object(clicked_tile);
  ghost_piece = tile_to_object(clicked_tile);
  //change piece's color value to its translucent version
  ghost_piece.color = to_translucent(clicked_piece.color);
  //add a listener to draw piece at current mouse position
  canvas.canvas.addEventListener("mousemove", mouse_move);
}

function mouse_move(event) {
  //update ghost piece's coordinates to current mouse position
  const click = absolute_to_relative(event.x, event.y);
  ghost_piece.x = click.x;
  ghost_piece.y = click.y;
}

function pointer_up(event) {
  //clear mouse move listener (stop drawing ghost piece)
  canvas.canvas.removeEventListener("mousemove", mouse_move);
  //TODO logic to make sure move is legal before delete
  delete_piece(clicked_piece.index); //0, 1, 2, 3, 4
  const relative_click = absolute_to_relative(event.x, event.y);
  const clicked_tile = click_to_tile(relative_click.x, relative_click.y);
  //draw clicked piece at new location
  board[clicked_tile] = clicked_piece.value; //0, 1, 2, 3, 4
  //clear clicked piece
  clicked_piece = null;
  ghost_piece = null;
}

//add pointer event listeners to canvas element
canvas.canvas.addEventListener("pointerdown", pointer_down);
canvas.canvas.addEventListener("pointerup", pointer_up);

function main_loop() {
  //the main animation loop to draw board visuals (approx 60fps)
  draw_board(0, 0);
  draw_pieces();
  requestAnimationFrame(main_loop);
}

requestAnimationFrame(main_loop);
