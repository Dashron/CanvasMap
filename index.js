var mapper = new Mapper(75);

mapper.load('/maps/main', function () {

	mapper.start(function () {
		mapper.setViewport(document.getElementById('viewport').getContext('2d'));
		mapper.start_tile.drawAllNeighbors(mapper.context);
		requestAnimationFrame(mapper.renderViewport.bind(mapper));
	});
});

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
