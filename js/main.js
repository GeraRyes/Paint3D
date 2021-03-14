import * as THREE from "/build/three.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import Stats from "/js/jsm/libs/stats.module.js";
import dat from '/js/jsm/libs/dat.gui.module.js';

"use strict";

let renderer, scene, camera, cameraControls, mesh, stats;


function init() {
    // RENDERER ENGINE
    renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer.setClearColor(new THREE.Color(1, 1, 1,));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    let fov = 60;
    let aspect = window.innerWidth / window.innerHeight;
    let near = 0.1;
    let far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 3);
    cameraControls = new OrbitControls(camera, renderer.domElement);

    // Inicialización de un modelo predeterminado
    var selected;
    var meshArr = [];
    let geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        let material = new THREE.MeshBasicMaterial({color: "red", wireframe: false});
        mesh = new THREE.Mesh(geometry, material);
        mesh.name = "Cube";
        scene.add(mesh);
        meshArr.push(mesh);
        selected= mesh;
    


    let gui = new dat.GUI();
    
    //Esta parte son los controles
    var guiControls = new function() {
        this.color = mesh.material.color.getStyle();
        this.rotationX = mesh.rotation.x;
        this.rotationY = mesh.rotation.x;
        this.positionX = mesh.position.x;
        this.positionY = mesh.position.y;
        this.positionZ = mesh.position.z;
        this.wireframe = mesh.material.wireframe;
      };
    gui.addColor(guiControls, "color").listen().onChange(function(e) {
    selected.material.color.setStyle(e);
    });;

    gui.add(guiControls, "rotationX", -3, 3).listen().onChange(function(e) {
    selected.rotation.x = e;
    });;

    gui.add(guiControls, "rotationY", -3, 3).listen().onChange(function(e) {
        selected.rotation.y = e;
    });;
    
    gui.add(guiControls, "positionX", -3, 3).listen().onChange(function(e) {
        selected.position.x = e;
    });;
    gui.add(guiControls, "positionY", -3, 3).listen().onChange(function(e) {
        selected.position.y = e;
    });;
    gui.add(guiControls, "positionZ", -3, 3).listen().onChange(function(e) {
        selected.position.z = e;
    });;
    gui.add(guiControls, "wireframe").listen().onChange(function(e) {
        selected.material.wireframe = e;
    });;



    //Con esto se crea un cubo
    let creationMenu = gui.addFolder("Creation Menu");
    var obj = { add:function(){
        let geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        let material = new THREE.MeshBasicMaterial({color: "red", wireframe: false});
        mesh = new THREE.Mesh(geometry, material);
        mesh.name = "Cube";
        scene.add(mesh);
        meshArr.push(mesh);
        selected= mesh;
    }};
    let cubeCreation = creationMenu.add(obj, "add");

    //Esto controla la selección con un click
    var intersects = [];
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    renderer.domElement.addEventListener("click", onClick)
    function onClick(event) {
        mouse.x = event.clientX / window.innerWidth * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(meshArr);
        if (intersects.length > 0) {
          selected = intersects[0].object;
          guiControls.color = selected.material.color.getStyle();
        }
    }


    gui.close()
    
    
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    
    renderLoop();
}

function renderLoop() {
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateMenu() {
    
}


document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
