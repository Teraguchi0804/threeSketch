/**
 * fileOverview:
 * Project:
 * File: Display3DCarousel
 * Date: 17/12/27
 * Author: Teraguchi
 */

// import Floating from '../visual/Floating';

'use strict';

export default class Display3DCarousel {

	constructor() {

		// this.floating = new Floating();

		this.setup();
		this.setEvents();

	}

	setup() {

		// this.floating.init();

	}

	onLoad() {


	}

	setEvents() {

		$(window).on('load', this.onLoad.bind(this));

	}

}