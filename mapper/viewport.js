var Viewport = (function () {
	"use strict";
	
	/**
	 * [ description]
	 * @param  {[type]} height    [description]
	 * @param  {[type]} width     [description]
	 * @param  {[type]} tile_side [description]
	 * @return {[type]}           [description]
	 */
	var Viewport = function (width, height, source_context) {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.source_context = source_context;
		this.height = this.context.canvas.height = height;
		this.width = this.context.canvas.width = width;
	};

	/**
	 * [source_context description]
	 * @type {[type]}
	 */
	Viewport.prototype.source_context = null;

	/**
	 * [canvas description]
	 * @type {[type]}
	 */
	Viewport.prototype.canvas = null;

	/**
	 * [context description]
	 * @type {[type]}
	 */
	Viewport.prototype.context = null;

	/**
	 * [x description]
	 * @type {[type]}
	 */
	Viewport.prototype.x = 0;

	/**
	 * [y description]
	 * @type {[type]}
	 */
	Viewport.prototype.y = 0;

	/**
	 * [height description]
	 * @type {[type]}
	 */
	Viewport.prototype.height = null;

	/**
	 * [width description]
	 * @type {[type]}
	 */
	Viewport.prototype.width = null;

	/**
	 * [tiles description]
	 * @type {[type]}
	 */
	Viewport.prototype.tiles = null;

	/**
	 * [ description]
	 * @param  {[type]} x_dir [description]
	 * @param  {[type]} y_dir [description]
	 * @return {[type]}       [description]
	 */
	Viewport.prototype.move = function (delta_x, delta_y) {
		this.x += delta_x;
		this.y += delta_y;

		if (this.x < 0) {
			this.x = 0;
		}

		if (this.x + this.width > this.source_context.width) {
			this.x = this.source_context.width;
		}

		if (this.y < 0) {
			this.y = 0;
		}

		if (this.y + this.height > this.source_context.height) {
			this.y = this.source_context.height;
		}

		if (this.onMove) {
			this.onMove();
		}
	};

	/**
	 * [ description]
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	Viewport.prototype.moveTo = function (x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * [renderViewport description]
	 * @return {[type]} [description]
	 */
	Viewport.prototype.render = function (time) {
		// wipe old content
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var read_width = null;
		var read_height = null;

		if (this.canvas.width > this.source_context.canvas.width) {
			read_width = this.source_context.canvas.width;
		} else {
			read_width = this.canvas.width;
		}

		if (this.canvas.height > this.source_context.canvas.height) {
			read_height = this.source_context.canvas.height;
		} else {
			read_height = this.canvas.height;
		}

		// draw from the source context at x,y with width and height
		this.context.drawImage(this.source_context.canvas, this.x, this.y,
										read_width, this.canvas.height,
										// onto the viewport context at 0,0 with width and height
										0, 0,
										read_width, read_height);

		// dev
		//this.context.strokeRect(this.viewport_x, this.viewport_y, this.viewport_context.canvas.width, this.viewport_context.canvas.height);
	};

	return Viewport;	
})();