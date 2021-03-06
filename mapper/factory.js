"use strict";

var Factory = function () {

}

Factory.prototype.requestUrl = function (url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.responseType = "text";
	xhr.onload = function (e) {
		try {
			var json = JSON.parse(this.response);
		} catch (e) {
			callback(null, e, this.status);
		} 
		// todo: handle other status codes
		if (this.status != 200) {
			callback(json, json, this.status);
		} else {
			callback(json, null, this.status);
		}
	};

	xhr.send();
}


var TileFactory = function (tile_creator) {
	Factory.call(this);

	this.createTile = tile_creator;
};

TileFactory.prototype = Object.create(Factory.prototype);
TileFactory.prototype.constructor = Factory;

TileFactory.prototype.createTile = function (json) {
	throw new Error('You must assign a tile creator method via setTileCreator');
};

TileFactory.prototype.load = function (url, callback) {
	var _self = this;
	this.requestUrl(url, function (json, error, status) {
		if (!error) {
			_self.createTile(json, callback);
		} else {
			callback(null, error);
		}
	});
};

TileFactory.prototype.loadNeighbors = function (neighbors, callback) {
	var tiles = {};

	for (var i = 0; i < neighbors.length; i++) {
		tiles[neighbors[i].position.x + ' ' + neighbors[i].position.y] = false;
		this.createTile(neighbors[i], function (tile) {
			tiles[tile.x + ' ' + tile.y] = tile;

			var final_tiles = [];
			var keys = Object.keys(tiles);

			for (var i = 0; i < keys.length; i++) {
				if (tiles[keys[i]] === false) {
					return;
				} else {
					final_tiles.push(tiles[keys[i]]);
				}
			}

			callback(final_tiles);
		});
	}

	return tiles;
};

var MapFactory = function (map_creator) {
	Factory.call(this);

	this.createMap = map_creator;
};

MapFactory.prototype = Object.create(Factory.prototype);
MapFactory.prototype.constructor = Factory;

MapFactory.prototype.createMap = function (json) {
	throw new Error('You must assign a map creator method via setMapCreator');
};

MapFactory.prototype.load = function (url, callback) {
	var _self = this;
	this.requestUrl(url, function (json, error, status) {
		if (!error) {
			_self.createMap(json, callback);
		} else {
			callback(null, error);
		}
	});
};
