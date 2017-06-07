import * as THREE from 'three';
import { Controller } from './Controller';

export class Brick extends THREE.Mesh {

    constructor(hue:number) {
        var geometry = new THREE.BoxGeometry(2, 1, 1, 1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        super(geometry, material);
        material.color.setHSL(hue, 1, 0.5);
    }
}