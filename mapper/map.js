"use strict";

/**
 * [Map description]
 * @param {[type]} context [description]
 */
var Map = function (width, height, tile_side) {
	this.tile_side = tile_side;

	this.context = document.createElement('canvas').getContext('2d');
	this.context.canvas.height = height;
	this.context.canvas.width = width;
	this.tiles = [];

	// dev
	this.context.canvas.style.border = "solid 1px red";
	document.getElementById('dev').appendChild(this.context.canvas);
};

/**
 * [tile_side description]
 * @type {[type]}
 */
Map.prototype.tile_side = null;

/**
 * map context
 * @type {[type]}
 */
Map.prototype.context = null;

//Map.prototype.sprites = {};

/**
 * Multidimensional array of tiles
 * @type {Object}
 */
Map.prototype.tiles = null;

/**
 * [start_tile description]
 * @type {[type]}
 */
Map.prototype.start_tile = null;

/**
 * [pending_callbacks description]
 * @type {Object}
 */
Map.prototype.pending_callbacks = null;

/**
 * Returns the tile that would contain viewport point x and y
 * 
 * @param  {[type]} viewport_x [description]
 * @param  {[type]} viewport_y [description]
 * @return {[type]}            [description]
 */
/*Map.prototype.getTile = function (viewport_x, viewport_y) {
	var corner = this.getTileCorner(viewport_x, viewport_y);
	return this.grid[corner.x + ' ' + corner.y];
};*/

/**
 * Returns the coordinates of the top left corner of the tile that would contain viewport point x and y
 * 
 * @param  {[type]} viewport_x [description]
 * @param  {[type]} viewport_y [description]
 * @return {[type]}            [description]
 */
/*Map.prototype.getTileCorner = function (viewport_x, viewport_y) {
	var map_x = viewport_x + this.viewport_x;
	var map_y = viewport_y + this.viewport_y;
	return this.getOriginCorner(map_x, map_y);
};*/

/**
 * Returns the coordinates of the top left corner of the tile that would contain map point x and y
 * 
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
/*Map.prototype.getOriginCorner = function (x, y) {
	var corner = {};
	corner.x = x - (x % this.tile_side);
	corner.y = y - (y % this.tile_side);

	return corner;
};*/

/**
 * [ description]
 * @param  {[type]} tile [description]
 * @return {[type]}      [description]
 */
Map.prototype.setStartTile = function (tile) {
	if (!tile instanceof Tile) {
		throw new Error('You can only provide a Tile object to the method "setStartTile"');
	}
	this.start_tile = tile;
	this.start_tile.context = this.context;
};

/**
 * [ description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Map.prototype.start = function (callback) {
	console.log('map start');
	if (!this.start_tile) {
		throw new Error('You can not start the Map without first setting a starting tile');
	}
	this.start_tile.draw(this.context, callback);
}