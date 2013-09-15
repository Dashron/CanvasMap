var TILE_STATES = {
	'NOT_LOADED' : 0,
	'LOADING' : 1,
	'LOADED' : 2,
	'DRAWING' : 3,
	'DRAWN' : 4
};

var tile_cache = {};

/**
 * [Tile description]
 * @param {[type]} data [description]
 * @param {[type]} x    [description]
 * @param {[type]} y    [description]
 * @param {[type]} len  [description]
 */
var Tile = function Tile (data, x, y, len) {
	if (data) {
		this.load(data, x, y, len);
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

/**
 * [load description]
 * @param  {[type]} data [description]
 * @param  {[type]} x    [description]
 * @param  {[type]} y    [description]
 * @param  {[type]} len  [description]
 * @return {[type]}      [description]
 */
Tile.prototype.load = function (data, x, y, len) {
	this.neighbors = data.neighbors;
	this.img = data.img;
	this.x = x;
	this.y = y;
	this.len = len;
	this.state = TILE_STATES.LOADED;
};

/**
 * [loadAllNeighbors description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Tile.prototype.loadAllNeighbors = function (callback) {
	var _self = this;
	var count = 0;

	var callbackWhenComplete = function (tile) {
		count--;

		if (count === 0 && typeof callback === "function") {
			return callback(_self.neighbors);
		}
	};

	for (var key in this.neighbors) {
		this.loadNeighbor(key, callbackWhenComplete);
		count++;
	}
};

/**
 * [loadNeighbor description]
 * @param  {[type]}   index    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Tile.prototype.loadNeighbor = function (index, callback) {
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
};

/**
 * [draw description]
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
Tile.prototype.draw = function (context) {
	var _self = this;
	this.state = TILE_STATES.DRAWING;

	_self.loadImage(function (image) {
		context.drawImage(image, _self.x, _self.y);
		_self.state = TILE_STATES.DRAWN;
	});
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
 * [getNeighborCorner description]
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
Tile.prototype.getNeighborCorner = function (index) {
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
};