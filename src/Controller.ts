import * as THREE from 'three';

export class Controller {
	private moveLeft: boolean;
	private moveRight: boolean;	
	private moveSpeed: number;

	public moveVector: THREE.Vector3;

	constructor() {
		this.moveSpeed = 50;
		this.moveVector = new THREE.Vector3( 0, 0, 0 );
		
		window.addEventListener( 'keydown', this.keydown.bind(this), false );
		window.addEventListener('keyup', this.keyup.bind(this), false);
		window.addEventListener('touchstart', this.touchStart.bind(this), false);
		window.addEventListener('touchend', this.touchEnd.bind(this), false);
		window.addEventListener('touchmove', this.touchStart.bind(this), false);

		this.updateMovementVector();
	}

	keydown( event : KeyboardEvent ) {
		if ( event.altKey ) return;

		switch ( event.keyCode ) {

			case 37: // left
			case 65: // A 
				this.moveLeft = true; 
				break;

			case 39: // right
			case 68: // D
				this.moveRight = true; 
				break;
		}

		this.updateMovementVector();
	};

	keyup ( event : KeyboardEvent) {
		switch ( event.keyCode ) {

			case 37: // left
			case 65: // A 
				this.moveLeft = false; 
				break;

			case 39: // right
			case 68: // D
				this.moveRight = false; 
				break;

		}

		this.updateMovementVector();
	};

	touchStart( event : TouchEvent) {
		if(event.touches.item(0).pageX > window.innerWidth / 2) {
			this.moveRight = true;
			this.moveLeft = false;
		}
		else {
			this.moveRight = false;
			this.moveLeft = true;
		}
		
		this.updateMovementVector();
	}
	touchEnd(event: TouchEvent) {
		this.moveRight = false;
		this.moveLeft = false;

		this.updateMovementVector();
	}

	updateMovementVector() {
		this.moveVector.x =  (this.moveLeft ? -this.moveSpeed : 0) + (this.moveRight ? this.moveSpeed : 0 );
	}
}