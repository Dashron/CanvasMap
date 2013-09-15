var mapper = new Mapper(75);

mapper.load('/maps/main', function () {

	mapper.start(function () {
		mapper.setViewport(document.getElementById('viewport').getContext('2d'));
		mapper.start_tile.loadAllNeighbors(loadToViewport);
		
		setTimeout(function () {
			mapper.renderViewport();
		}, 700);
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

		neighbor.draw(mapper.context);
		//FUCK
		//The problem is that we aren't tying back in the additional paths
		//  a -> b
		//  |    |
		// \ /  \ /
		//  c -> d
		//  
		//  a loads b then c. c loads d (or maybe b loads d). then the other one (b or c) will load d as a new entity.
		//  Before we load an element, we need to check and see if that element exists. I think this is the final straw, we need unique tiles
		//  with duplicate images, no self references map tiles :(
		//  
		neighbor.loadAllNeighbors(loadToViewport);
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