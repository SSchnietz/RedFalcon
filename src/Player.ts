import * as THREE from 'three';
import { Controller } from './Controller';

export class Player extends THREE.Mesh {

    private playerSpeed : number;

    constructor() {
        var geometry = new THREE.BoxGeometry(6, 1, 1, 1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        super(geometry, material);

        this.playerSpeed = 0.75;
    }

    update(deltaTime: number, controller:Controller): void {
        this.translateX(controller.moveVector.x * deltaTime * this.playerSpeed);
    }
}