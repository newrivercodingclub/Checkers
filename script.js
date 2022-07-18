let board = [
  0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2,
  0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0,
];

let legalBoard = [1, 3, 5, 7, 8, 10, 12, 14];

const tileWidth = 90;
const canvasSize = 720;
//colors selected from https://coolors.co/palettes/trending
const colors = {
  light: "#eff6e0",
  dark: "#01161e",
  blue: "#197278",
  red: "#c44536",
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
  if (x < 720) {
    const new_color = color_iterator(color);
    canvas.ctx.fillStyle = new_color;
    canvas.ctx.fillRect(x, y, tileWidth, tileWidth);
    const new_x = x + tileWidth;
    draw_board(new_x, y, new_color);
  } else if (x >= 720 && y < 720) {
    const new_x = 0;
    const new_y = y + tileWidth;
    const new_color = color_iterator(color);
    draw_board(new_x, new_y, new_color);
  }
}

const tile_to_object = (tile, index) => {
  //takes an input tile value (0,1,2,3,4) along with its index (0-63)
  //and converts it into an object to be drawn on the canvas
  const radius = (tileWidth / 2) * 0.9;
  const x = (index % 8) * tileWidth + radius * 1.1;
  const y = Math.floor(index / 8) * tileWidth + radius * 1.1;
  const value = tile;
  const color = tile < 2 ? colors.blue : colors.red;
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
  return (tiles = board.map((value, index) => tile_to_object(value, index)));
}

function get_active_tiles() {
  //get current tile objects
  const tiles = get_tiles();
  //return all tiles that contain a piece as an array
  return (active_tiles = tiles.filter((obj) => obj.value > 0));
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
}

function click_to_tile(click_x, click_y) {
  //returns the tile clicked (0-63) given input click cordinates
  const x = Math.floor(click_x / tileWidth);
  const y = Math.floor(click_y / tileWidth);
  console.log(x, y);
  return x + y * 8;
}

canvas.canvas.addEventListener("click", (event) => {
  //convert click from absolute to relative coords
  const click_x = event.x - canvas.rect.left;
  const click_y = event.y - canvas.rect.top;
  //convert relative coords to tile index (0-63)
  const clicked_tile = click_to_tile(click_x, click_y);
  //update board. for demonstration purposes, draw new piece at click
  board[clicked_tile] = 1;
});

function main_loop() {
  //the main animation loop to draw board visuals (approx 60fps)
  draw_board(0, 0);
  draw_pieces();
  requestAnimationFrame(main_loop);
}

requestAnimationFrame(main_loop);
