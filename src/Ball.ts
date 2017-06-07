import * as THREE from 'three';
import { Brick } from './Brick';

export class Ball extends THREE.Object3D {

    private ballDirection: THREE.Vector3;
    private ballSpeed: number;
    private ballMove: THREE.Vector3;
    private raycaster : THREE.Raycaster;
    private size : number;

    constructor(size:number) {
        super();

        this.size = size;

        var ballGeometry = new THREE.BoxGeometry(size, size, size, 1, 1, 1);
        var ballMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        var ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
        this.add(ballMesh);

        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = size;

        this.init();
    }

    init() {
        this.position.set(0,0,5);
        this.ballDirection = new THREE.Vector3(Math.random() - 0.5, 0, 0.5);
        this.ballDirection.normalize();
        this.ballSpeed = 25;
        this.ballMove = new THREE.Vector3();
    }

    update(deltaTime: number, level:THREE.Group, player:THREE.Object3D): void {        
        let halfSize = this.size / 2.0;

		// Check collision for each ball edge
        var nearestIntersection = this.checkCollision(new THREE.Vector3(-halfSize, 0, -halfSize),level, null);
        nearestIntersection = this.checkCollision(new THREE.Vector3(halfSize, 0, -halfSize),level, nearestIntersection);
        nearestIntersection = this.checkCollision(new THREE.Vector3(halfSize, 0, halfSize),level, nearestIntersection);
        nearestIntersection = this.checkCollision(new THREE.Vector3(-halfSize, 0, halfSize),level, nearestIntersection);
        
        if (nearestIntersection) {            
            if (nearestIntersection.object === player) { // Check if we hit the player
                // Player, adjust outbound angle by hit position
                var xPositionDistance = THREE.Math.clamp((this.position.x - player.position.x) / 4, -4, 4);
                this.ballDirection.set(xPositionDistance, 0, -1);
                this.ballDirection.normalize();
            }
            else if (nearestIntersection.object instanceof Brick) { // Brick, remove and reflect direction
                level.remove(nearestIntersection.object);
                this.ballDirection.reflect(nearestIntersection.face.normal);
            }
			else { // else reflect direction
                this.ballDirection.reflect(nearestIntersection.face.normal);
			}
        }

        let ballPosition = this.position;
        ballPosition.add(this.ballMove.copy(this.ballDirection).multiplyScalar(this.ballSpeed * deltaTime));
        this.position.copy(ballPosition);        
    }

    private checkCollision(offset:THREE.Vector3, level:THREE.Group, previousIntersection: THREE.Intersection) : THREE.Intersection {
        let rayStart = new THREE.Vector3();
        rayStart.copy(this.position);
        rayStart.add(offset);
        this.raycaster.set(rayStart, this.ballDirection);

        let intersections = this.raycaster.intersectObjects(level.children);
        let firstIntersection = intersections.length > 0 ? intersections[0] : null;

        if (firstIntersection 
            && firstIntersection.distance < this.ballMove.length() 
            && (!previousIntersection || previousIntersection.distance > firstIntersection.distance)) {
            return firstIntersection;
        }           

        return previousIntersection;
    }
}