import * as THREE from 'three';
import { Brick } from './Brick';

export class LevelBuilder {
	public static build(level:THREE.Group, size:THREE.Vector2, blocks:THREE.Vector2) {
        
        var halfBoardSize = new THREE.Vector2();
        halfBoardSize.copy(size);
        halfBoardSize.multiplyScalar(0.5);
        halfBoardSize.sub(new THREE.Vector2(0.5,0.5)); // half ball size

        // Create the floor
        var levelMaterial = new THREE.MeshPhongMaterial({ color: 0xA0A0A0 });
        var floor = new THREE.Mesh(new THREE.PlaneGeometry(size.x, size.y, 1, 1), levelMaterial)
        floor.rotateX(THREE.Math.degToRad(-90));
        floor.position.setY(-0.5);
        level.add(floor);

        // Create the walls
        var topWall = new THREE.Mesh(new THREE.BoxGeometry(size.x, 2, 0.1, 1, 1,1), levelMaterial);
        topWall.position.setZ(-size.y / 2.0);
        topWall.position.setY(0.5);
        level.add(topWall);

        var leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2, size.y, 1, 1, 1), levelMaterial);
        leftWall.position.setX(-size.x / 2.0);
        leftWall.position.setY(0.5);
        level.add(leftWall);

        var rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2, size.y, 1, 1, 1), levelMaterial);
        rightWall.position.setX(size.x / 2.0);
        rightWall.position.setY(0.5);
        level.add(rightWall);

		// Add light
		var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 500, 0 );
		level.add( hemiLight );

		var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
		dirLight.color.setHSL( 0.1, 1, 0.95 );
		dirLight.position.set( -1, 1.75, 1 );
		level.add( dirLight );
        
        var brickStepX = 3;
        var brickStepY = 1;

        var startX = - ((blocks.x-1) * brickStepX) / 2.0;
        var startZ = -20 - (blocks.y * 1) / 2 + 1 / 2;

        for (let row = 0; row < blocks.y; row++) {
            for (let col = 0; col < blocks.x; col++) {
                let brick = new Brick(1 / blocks.y * row);
                brick.position.x = startX + col * brickStepX;
                brick.position.z = startZ + row * 2;
                level.add(brick);
            }
        }
    }
}