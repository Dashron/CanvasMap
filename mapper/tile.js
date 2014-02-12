var Tile = (function () {
	"use strict";

	var TILE_STATES = {
		'NOT_LOADED' : 0,
		'LOADING' : 1,
		'LOADED' : 2,
		'DRAWING' : 3,
		'DRAWN' : 4
	};

	/**
	 * [Tile description]
	 * @param {[type]} data [description]
	 * @param {[type]} x    [description]
	 * @param {[type]} y    [description]
	 * @param {[type]} len  [description]
	 */
	var Tile = function Tile (uri, x, y, image, neighbors) {
		if (typeof x !== "undefined" && typeof y !== "undefined" && image && uri) {
			this.x = x;
			this.y = y;
			this.img = image;
			this.neighbors = neighbors;
			this.uri = uri;
			this.state = TILE_STATES.LOADED;
		} else {
			this.state = TILE_STATES.NOT_LOADED;
		}
	};

	Tile.prototype.neighbors = null;
	Tile.prototype.img = null;
	Tile.prototype.x = null;
	Tile.prototype.y = null;
	Tile.prototype.len = null;
	Tile.prototype.state = TILE_STATES.NOT_LOADED;
	Tile.prototype.uri = null;
	Tile.prototype.collision_map = null;
	
	/**
	 * [loadAllNeighbors description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	Tile.prototype.loadAllNeighbors = function (callback) {
		var _self = this;

		var callbackWhenComplete = function (tile) {
			var key = null;
			// if any of the neighbors have not yet been loaded, do not fire the callback
			for (key in _self.neighbors) {
				if (_self.neighbors[key].state != TILE_STATES.LOADED) {
					return;
				}
			}
			if (callback) {
				return callback();
			}
		};

		for (var key in this.neighbors) {
			this.loadNeighbor(key, callbackWhenComplete);
		}
	};

	/**
	 * [draw description]
	 * @param  {[type]} context [description]
	 * @return {[type]}         [description]
	 */
	Tile.prototype.draw = function (context, callback) {
		var _self = this;
		if (this.state == TILE_STATES.LOADED) {
			this.state = TILE_STATES.DRAWING;

			_self.loadImage(function (image) {
				context.drawImage(image, _self.x * _self.len, _self.y * _self.len);
				_self.state = TILE_STATES.DRAWN;
				if (callback) {
					callback();
				}
			});
		}
	};

	/**
	 * [loadImage description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	Tile.prototype.loadImage = function (callback) {
		var _self = this;

		if (typeof this.img === null) {
			throw new Error('invalid tile image');
		}

		if (this.img instanceof Image) {
			return callback(this.img);
		}

		//	if tile.type === "sprite") {
		//		return self.loadImage(tile.src, function (image) {
		//			callback(subimage(image, tile.x, tile.y));
		//		});
		//	}

		var image = new Image();
		image.onload = function (event) {
			_self.img = image;
			callback(image);
		};

		image.src = this.img;
	};

	/**
	 * [ description]
	 * @param  {[type]} collision_map [description]
	 * @return {[type]}               [description]
	 */
	Tile.prototype.setCollision = function (collision_map) {
		this.collision_map = new Uint32Array(collision_map.length);

		var row = 0;
		var len = 0;

		// this need to be broken into 32 bit integers and 32 length arrays
		for (var i = 0; i < collision_map.length; i++) {
			row = 0;
			len = collision_map[i].length;
			for (var j = 0; j < len; j++) {
				// multiply the 1 or 0 by 2 to the power of the digit position (left high right 0)
				row += collision_map[i][j] * Math.pow(2, (len - j - 1));
			}
			this.collision_map[i] = row;
		}
	}

	/**
	 * [ description]
	 * @param  {[type]} mapper [description]
	 * @return {[type]}        [description]
	 */
	/*Tile.prototype.drawAllNeighbors = function (context, callback) {
		var _self = this;

		if (!callback) {
			callback = context;
			context = this.context;
		}
		
		var callbackWhenComplete = function () {
			for(var key in _self.neighbors) {
				if (_self.neighbors[key].state != TILE_STATES.DRAWN) {
					return;
				}
			}

			if (callback) {
				return callback();
			}
		};

		this.loadAllNeighbors(function () {
			for (var key in _self.neighbors) {
				if (_self.neighbors[key].state != TILE_STATES.DRAWN) {
					_self.neighbors[key].draw(context, callbackWhenComplete);
				}
			}
		});
	};*/

	/**
	 * [loadNeighbor description]
	 * @param  {[type]}   index    [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	/*Tile.prototype.loadNeighbor = function (index, callback) {
		var _self = this;

		if (typeof this.neighbors[index] === "object") {
			return callback(this.neighbors[index]);
		}

		var url = this.neighbors[index];

		// todo this isn't working
		if (typeof tile_cache[url] === "object") {
			this.neighbors[index] = tile_cache[url];
			return callback(tile_cache[url]);
		}

		var tile = new Tile();
		tile_cache[url] = tile;
		_self.neighbors[index] = tile;

		var xhr = new XMLHttpRequest();
	 
		xhr.open("GET", url, true);
		xhr.responseType = "text";

		xhr.onload = function(e) {
			var tile_data = JSON.parse(this.response);
			var corner = _self.getNeighborCorner(index);

			tile.load(tile_data, corner.x, corner.y, _self.len);

			if (typeof callback === "function") {
				callback(tile);
			}
		};

		xhr.send();
		tile.state = TILE_STATES.LOADING; 
	};*/


	/**
	 * [getNeighborCorner description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	/*Tile.prototype.getNeighborCorner = function (index) {
		var corner = {};

		switch (index) {
			case "1" : 
			case "4" : 
			case "7" :
				corner.x = this.x - this.len;
				break;

			case "2" :
			case "5" :
			case "8" :
				corner.x = this.x;
				break;

			case "3" :
			case "6" :
			case "9" :
				corner.x = this.x + this.len;
				break;

			default :
				throw new Error('Unsupported neighbor index');
		}

		switch (index) {
			case "1" :
			case "2" :
			case "3" :
				corner.y = this.y - this.len;
				break;

			case "4" :
			case "5" :
			case "6" :
				corner.y = this.y;
				break;

			case "7" :
			case "8" :
			case "9" :
				corner.y = this.y + this.len;
				break;

			default :
				throw new Error('Unsupported neighbor index');
		}

		return corner;
	};*/
	return Tile;
})();