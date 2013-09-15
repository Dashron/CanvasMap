"use strict";

var pending_callbacks = [];

/**
 * [Mapper description]
 * @param {[type]} context [description]
 */
var Mapper = function () {
	this.context = document.createElement('canvas').getContext('2d');
	this.pending_callbacks = {};
	this.grid = {};

	// dev
	this.context.canvas.style.border = "solid 1px red";
	document.getElementById('dev').appendChild(this.context.canvas);
};

/**
 * map context
 * @type {[type]}
 */
Mapper.prototype.context = null;

//Mapper.prototype.sprites = {};

/**
 * cached hash of "x y" => tile
 * @type {Object}
 */
Mapper.prototype.grid = null;


/**
 * the json config for the map
 * @type {[type]}
 */
Mapper.prototype.map_data = null;

/**
 * viewport context
 * @type {[type]}
 */
Mapper.prototype.viewport_context = null;

/**
 * viewport x position relative to the map context
 * @type {[type]}
 */
Mapper.prototype.viewport_x = null;

/**
 * viewport y position relative to the map context
 * @type {[type]}
 */
Mapper.prototype.viewport_y = null;

/**
 * [viewport_height description]
 * @type {[type]}
 */
Mapper.prototype.viewport_height = null;

/**
 * [viewport_width description]
 * @type {[type]}
 */
Mapper.prototype.viewport_width = null;

/**
 * [pending_callbacks description]
 * @type {Object}
 */
Mapper.prototype.pending_callbacks = null;

/**
 * [setViewport description]
 * @param {[type]} context [description]
 */
Mapper.prototype.setViewport = function (context, start_x, start_y, position) {
	this.viewport_context = context;
	this.viewport_height = context.canvas.height;
	this.viewport_width = context.canvas.width;

	start_x = start_x ? start_x : this.map_data.start.x;
	start_y = start_y ? start_y : this.map_data.start.y;
	position = position ? position : this.map_data.start.position;

	switch (position) {
		case "center" :
				start_x = start_x - this.viewport_height / 2;
				start_y = start_y - this.viewport_height / 2;
			break;

		default :
			throw new Error('unsupported viewpoint origin');
	}


	this.viewport_x = start_x;
	this.viewport_y = start_y;
};

/**
 * [start_tile description]
 * @type {[type]}
 */
Mapper.prototype.start_tile = null;

/**
 * [moveViewport description]
 * @param  {[type]} x_dir [description]
 * @param  {[type]} y_dir [description]
 * @return {[type]}       [description]
 */
Mapper.prototype.moveViewport = function (x_dir, y_dir) {
	this.viewport_x += x_dir;
	this.viewport_y += y_dir;

	// moving right
	/*if (x_dir > 0) {
		var top_tile = this.getTile(this.viewport_width, 0);
		var bottom_tile = this.getTile(this.viewport_width, this.viewport_height);
		
		top_tile.loadNeighbor(3);
		foreach top to bottom as tile (using 8)
			tile.loadNeighbor 6

		bottom_tile.loadNeighbor(9);
	}

	// moving left
	if (x_dir < 0) {
		var top_tile = this.getTile(0, 0);
		var bottom_tile = this.getTile(0, this.viewport_height);
		
		top_tile.loadNeighbor(1);
		foreach top to bottom as tile (using 8)
			tile.loadNeighbor 4

		bottom_tile.loadNeighbor(7);
	}

	// moving down
	if (y_dir > 0) {
		var left_tile = this.getTile(0, this.viewport_height);
		var right_tile = this.getTile(this.viewport_width, this.viewport_height);
		
		left_tile.loadNeighbor(7);
		foreach left to right as tile (using 6)
			tile.loadNeighbor 8

		right_tile.loadNeighbor(9);
	}

	// moving up
	if (y_dir < 0) {
		var left_tile = this.getTile(0, 0);
		var right_tile = this.getTile(0, this.viewport_width);

		left_tile.loadNeighbor(1);
		foreach left to right as tile (using 6)
			tile.loadNeighbor 2

		right_tile.loadNeighbor(3);
	}*/

	this.renderViewport();
};

/**
 * [renderViewport description]
 * @return {[type]} [description]
 */
Mapper.prototype.renderViewport = function () {
	// wipe old content
	this.viewport_context.clearRect(0, 0, this.viewport_context.canvas.width, this.viewport_context.canvas.height);

	// write subset
	this.viewport_context.drawImage(this.context.canvas, this.viewport_x, this.viewport_y,
									this.viewport_context.canvas.width, this.viewport_context.canvas.height,
									0, 0,
									this.viewport_context.canvas.width, this.viewport_context.canvas.height);

	// dev
	//this.context.strokeRect(this.viewport_x, this.viewport_y, this.viewport_context.canvas.width, this.viewport_context.canvas.height);
};

/**
 * Returns the tile that would contain viewport point x and y
 * 
 * @param  {[type]} viewport_x [description]
 * @param  {[type]} viewport_y [description]
 * @return {[type]}            [description]
 */
Mapper.prototype.getTile = function (viewport_x, viewport_y) {
	var corner = this.getTileCorner(viewport_x, viewport_y);
	return this.grid[corner.x + ' ' + corner.y];
};

/**
 * Returns the coordinates of the top left corner of the tile that would contain viewport point x and y
 * 
 * @param  {[type]} viewport_x [description]
 * @param  {[type]} viewport_y [description]
 * @return {[type]}            [description]
 */
Mapper.prototype.getTileCorner = function (viewport_x, viewport_y) {
	var map_x = viewport_x + this.viewport_x;
	var map_y = viewport_y + this.viewport_y;
	return this.getOriginCorner(map_x, map_y);
};

/**
 * Returns the coordinates of the top left corner of the tile that would contain map point x and y
 * 
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
Mapper.prototype.getOriginCorner = function (x, y) {
	var corner = {};
	corner.x = x - (x % this.map_data.tile_side);
	corner.y = y - (y % this.map_data.tile_side);

	return corner;
};

/**
 * [loadMap description]
 * @param  {[type]} url        source url of the map json
 * @param  {[type]} start_tile can be used if the user is starting somewhere beyond the default start tile
 * @return ReadyPromise        exposes a "ready" function, which takes a function, which will be called when the map data has been loaded, and the first map tile has been queued up.
 *                                      This does not mean all the tiles exist. It simply means that the initial map data is loaded, and the map contexts height and width are set
 */
Mapper.prototype.load = function (url, callback) {
	var _self = this;

	var xhr = new XMLHttpRequest();
 
	xhr.open("GET", url, true);
	xhr.responseType = "text";

	xhr.onload = function(e) {
		var map_data = JSON.parse(this.response);
		_self.map_data = map_data;

		_self.context.canvas.height = _self.map_data.height;
		_self.context.canvas.width = _self.map_data.width;

		if (typeof callback === "function") {
			callback();
		}
	};

	xhr.send();
};

/**
 * Load the first title, and draw it on the screen.
 * 
 * @param  {[type]} start_tile [description]
 * @param  {[type]} start_x    [description]
 * @param  {[type]} start_y    [description]
 * @param  {[type]} position   [description]
 * @return {[type]}            [description]
 */
Mapper.prototype.start = function (callback) {
	var _self = this;
	var xhr = new XMLHttpRequest();
 
	xhr.open("GET", this.map_data.start.tile, true);
	xhr.responseType = "text";

	xhr.onload = function(e) {
		var tile_data = JSON.parse(this.response);

		_self.start_tile = new Tile(tile_data, _self.map_data.start.x, _self.map_data.start.y, _self.map_data.tile_side);
		_self.start_tile.draw(_self.context);
		callback();
	};

	xhr.send();
};