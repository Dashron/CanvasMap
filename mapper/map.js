var Map = (function () {
	"use strict";
	
	/**
	 * [Map description]
	 * @param {[type]} context [description]
	 */
	var Map = function (width, height, tile_side) {
		this.tile_side = tile_side;

		this.context = document.createElement('canvas').getContext('2d');
		this.context.canvas.height = height * tile_side;
		this.context.canvas.width = width * tile_side;
		this.tile_map = [];
		this.tile_list = [];

		// dev
		//this.context.canvas.style.border = "solid 1px red";
		//document.getElementById('dev').appendChild(this.context.canvas);
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
	Map.prototype.tile_map = null;

	/**
	 * Singledimensional array of tiles
	 * @type {Object}
	 */
	Map.prototype.tile_list = null;

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
	 * [ description]
	 * @param  {[type]} x    [description]
	 * @param  {[type]} y    [description]
	 * @param  {[type]} tile [description]
	 * @return {[type]}      [description]
	 */
	Map.prototype.addTile = function (tile) {
		this.tile_list.push(tile);

		if (!Array.isArray(this.tile_map[tile.x])) {
			this.tile_map[tile.x] = [];
		}

		this.tile_map[tile.x][tile.y] = tile;
		tile.len = this.tile_side;
	};

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
		this.addTile(tile);
	};

	/**
	 * [ description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	Map.prototype.start = function (callback) {
		if (!this.start_tile) {
			throw new Error('You can not start the Map without first setting a starting tile');
		}
		this.start_tile.draw(this.context, callback);
	};

	/**
	 * [draw description]
	 * @param  {[type]} context [description]
	 * @return {[type]}         [description]
	 */
	Map.prototype.draw = function (tile_x, tile_y, callback) {
		var tile = this.tile_map[tile_x][tile_y];
		
		if (!tile) {
			return callback ? callback() : null;
		}

		tile.draw(this.context, callback);
	};

	/**
	 * [ description]
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	Map.prototype.getTileFromCoords = function (x, y) {
		var tile_x = this.tile_map[Math.floor(x/this.tile_side)];
		var tile = null;

		if (tile_x) {
			tile = tile_x[Math.floor(y/this.tile_side)];
		}

		if (tile instanceof Tile) {
			return tile;
		}

		return false;
	};

	/**
	 * [ description]
	 * @param  {[type]} viewport [description]
	 * @param  {[type]} factory  [description]
	 * @return {[type]}          [description]
	 */
	/*Map.prototype.drawToViewport = function (viewport, factory) {
		var _self = this;
		factory.loadNeighbors(this.start_tile.neighbors.items, function (neighbors) {
			for (var i = 0; i < neighbors.length; i++) {
				_self.addTile(neighbors[i]);
				_self.draw(neighbors[i].x, neighbors[i].y);
			}
		});
	};*/

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
	return Map;
})();