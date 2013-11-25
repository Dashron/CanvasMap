"use strict";

var tile_factory = new TileFactory(function (json, callback) {
	var tile = new Tile(json.position.x, json.position.y, json.image_uri);
	tile.setNeighbors(json.neighbors);

	callback(tile);
});

var map_factory = new MapFactory(function (json, callback) {
	var map = new Map(json.width, json.height, json.tile_side);
	tile_factory.createTile(json.start, function (tile) {
		map.setStartTile(tile);
		callback(map);
	});
});

map_factory.load('/maps/15', function (map, error) {
	map.start(function () {
		var start_x = map.start_tile.x;
		var start_y = map.start_tile.y;
		var position = "center";
		var viewport = new Viewport(800, 600, map.context);
		viewport.moveTo(start_x, start_y);
		
		// dev
		viewport.canvas.style.border = "solid 1px black";
		var render = function (time) {
			viewport.render(time);
			requestAnimationFrame(render);
		}

		requestAnimationFrame(render);

		document.getElementById('viewport').appendChild(viewport.canvas);
	});
});

/*

var mapper = new Mapper(75);

mapper.load('/maps/main', function () {

	mapper.start(function () {
		mapper.setViewport(document.getElementById('viewport').getContext('2d'));
		mapper.start_tile.drawAllNeighbors(mapper.context);
		requestAnimationFrame(mapper.renderViewport.bind(mapper));
	});
});*/

function loadToViewport(neighbors) {
	var neighbor = null;

	for (var key in neighbors) {
		neighbor = neighbors[key];

		if (neighbor.x < mapper.viewport_x || neighbor.x > mapper.viewport_x + mapper.viewport_width) {
			continue;
		}

		if (neighbor.y < mapper.viewport_y || neighbor.y > mapper.viewport_y + mapper.viewport_height) {
			continue;
		}

		//neighbor.loadAllNeighbors(loadToViewport);
	}
}

window.addEventListener('keypress', function (event) {
	switch (event.keyCode) {
		case 37 :
			// left
			mapper.moveViewport(-10, 0);
			event.preventDefault();
			break;

		case 38 :
			// up
			mapper.moveViewport(0, -10);
			event.preventDefault();
			break;

		case 39 :
			// right
			mapper.moveViewport(10, 0);
			event.preventDefault();
			break;

		case 40 :
			// down
			mapper.moveViewport(0, 10);
			event.preventDefault();
			break;
	}
});
