import * as THREE from 'three';
import { Controller } from './Controller';
import { LevelBuilder } from './LevelBuilder';
import { Ball } from './Ball';
import { Player } from './Player';

export class Game {
    private renderer:THREE.WebGLRenderer;
	private clock: THREE.Clock;
	
	private ballSize : number = 1;
	private halfGameBoardSize: THREE.Vector2 = new THREE.Vector2(30,40);

	private scene : THREE.Scene;
	private camera: THREE.PerspectiveCamera;

	private controller : Controller;
	private level: THREE.Group;
	private ball: Ball;
	private player: Player;

	private ready: boolean;

    constructor() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.autoClearColor = true;
		this.renderer.setClearColor(new THREE.Color(0x303030));
    	this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		
		window.addEventListener( 'resize', this.onResize.bind(this), false );
		
		this.clock = new THREE.Clock();

		this.controller = new Controller();		

		this.scene = new THREE.Scene();

		// Create a camera
		this.camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,1000);
		this.camera.position.set(0,30,60);
		this.camera.lookAt(new THREE.Vector3(0,0,0));
		this.scene.add(this.camera);

		// Create the level
		this.level = new THREE.Group();
		LevelBuilder.build(this.level, new THREE.Vector2(50,60),new THREE.Vector2(16,15));
		this.scene.add(this.level);

		// Create the ball
		this.ball = new Ball(1);
		this.scene.add(this.ball);
		
		// Create the paddle
		this.player = new Player();
		this.player.position.setZ(28);
		this.level.add(this.player);

		var loader = new THREE.FontLoader();
				loader.load( 'fonts/Womby_Regular.json', response => {
					this.createText(response);
				} );

		// Scene is read and can be rendered
		this.ready = true;
	}

	createText(font : THREE.Font) {		
		var titleGeometry = new THREE.TextGeometry( "PIT Hackathon 2017", {
			font: font,
			size: 7,
			height: 4
		});

        var titleMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
		var title = new THREE.Mesh(titleGeometry, titleMaterial);

		titleGeometry.computeBoundingBox();		
		var centerOffset = -0.5 * ( titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x );

		title.position.set(centerOffset,4,-35);
		this.scene.add(title);
	}
	
	update(deltaTime: number): void {
		if (!this.ready) return;

		this.player.update(deltaTime, this.controller);
		this.ball.update(deltaTime, this.level, this.player);

		// Is ball outside of the game area?
        if (this.ball.position.z > 45) {
            this.ball.init();
        }
	}

    render = () => {
        requestAnimationFrame( this.render );
		let delta = this.clock.getDelta();

		if(!this.ready) return;
        this.update(delta);
		this.renderer.render(this.scene, this.camera);
    }

	onResize() {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.camera.aspect = window.innerWidth/window.innerHeight;
		this.camera.updateProjectionMatrix();
	}
}

var game = new Game();
game.render();
console.log("Started");