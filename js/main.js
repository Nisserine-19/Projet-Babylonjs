var canvas;
var engine = null;
var scene = null;
var sceneToRender = null;

let translateVectorLeft = new BABYLON.Vector3(1, 0, 0);
let translateVectorRight = new BABYLON.Vector3(-1, 0, 0);
let ball;
let inputStates = {};

inputStates.left = false;
inputStates.right = false;


window.addEventListener('keydown', (event) => {
    if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
        inputStates.left = true;
    } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
        inputStates.right = true;
    }
}, false);

window.addEventListener('keyup', (event) => {
    if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
        inputStates.left = false;
    } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
        inputStates.right = false;
    }
}, false);


var createDefaultEngine = function () {
    console.log("dans createDefaultEngine")
    return new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false
    });
};

window.initFunction = async function () {
    engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false
    });
    console.log("INIT 2");
    canvas = document.getElementById("myCanvas");

    var asyncEngineCreation = async function () {
        console.log("engine creation")
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log(
                "the available createEngine function failed. Creating the default engine instead"
            );
            return createDefaultEngine();
        }
    }

    engine = await asyncEngineCreation();

    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            if (inputStates.left) {
                ball.translate(translateVectorLeft, 0.3, BABYLON.Space.LOCAL);
            }

            if (inputStates.right) {
                ball.translate(translateVectorRight, 0.3, BABYLON.Space.LOCAL);
            }
            sceneToRender.render();
        }
    });

    scene = createScene();
    ball = scene.getMeshByName("moon");

};

initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});



const createScene = function () {
    const scene = new BABYLON.Scene(engine);


    var music = new BABYLON.Sound("Music", "/music/music.mp3", scene, null, {
        loop: true,
        autoplay: true,
        volume: 0.3
    });


    // Skybox
    var stars = BABYLON.MeshBuilder.CreateBox("stars", { size: 5000, sideOrientation: BABYLON.Mesh.BACKSIDE }, scene);
    var starMat = new BABYLON.StandardMaterial("stars", scene);
    var urlStar = "http://jerome.bousquie.fr/BJS/images/stars1.jpg"
    var texStar = new BABYLON.Texture(urlStar, scene);
    texStar.uScale = 3;
    texStar.vScale = 3;
    starMat.diffuseTexture = texStar;
    stars.material = starMat;


    const camera = new BABYLON.ArcRotateCamera("Camera", 0, 10, 0, new BABYLON.Vector3(0, 0, -90), scene);
    camera.detachControl(canvas, true);
    camera.setPosition(new BABYLON.Vector3(0, 110, 50));

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 1), scene);
    const moon = BABYLON.MeshBuilder.CreateSphere("moon", { diameter: 7, segments: 32 });
    const moonMaterials = new BABYLON.StandardMaterial("moonMaterial", scene);
    moon.material = moonMaterials;
    moonMaterials.diffuseTexture = new BABYLON.Texture("images/wood.jpg", scene);


    const earth = BABYLON.MeshBuilder.CreateSphere("earth", { diameter: 150, segments: 32 });
    const earthMaterials = new BABYLON.StandardMaterial("earthMaterial", scene);
    earth.material = earthMaterials;
    moon.position.y = 80;
    earthMaterials.diffuseTexture = new BABYLON.Texture("images/snow.jpg", scene);



    var spot = new BABYLON.SpotLight("spot", new BABYLON.Vector3(25, 15, -10), new BABYLON.Vector3(-1, -0.8, 1), 15, 1, scene);
    spot.diffuse = new BABYLON.Color3(0.73, 0.73, 0.73);
    spot.specular = new BABYLON.Color3(0, 0, 0);
    spot.intensity = 0.4;

    var leafMaterial = new BABYLON.StandardMaterial("leafMaterial", scene);
    leafMaterial.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5);

    var woodMaterial = new BABYLON.StandardMaterial(name, scene);
    var woodTexture = new BABYLON.WoodProceduralTexture(name + "text", 512, scene);
    woodTexture.ampScale = 20;
    woodMaterial.diffuseTexture = woodTexture;

    const torus1 = BABYLON.MeshBuilder.CreateTorus("torus", { diameter: 160, tessellation: 200, thickness: 5 });
    const torus2 = BABYLON.MeshBuilder.CreateTorus("torus2", { diameter: 160, tessellation: 200, thickness: 5 });



    torus1.position.x = 23;
    torus1.rotation.z = 1.57;
    torus2.position.x = -26;
    torus2.rotation.z = 1.57;



    const torusMaterials = new BABYLON.StandardMaterial("torusMaterial", scene);
    torus1.material = torusMaterials;
    torus2.material = torusMaterials;
    torusMaterials.diffuseTexture = new BABYLON.Texture("images/torus.jpg", scene);

    scene.registerBeforeRender(() => {
        earth.rotation.x += 0.011;
        moon.rotation.x += -0.05;
    })


    var simplePineGenerator = function (canopies, height, trunkMaterial, leafMaterial) {
        var curvePoints = function (l, t) {
            var path = [];
            var step = l / t;
            for (var i = 0; i < l; i += step) {
                path.push(new BABYLON.Vector3(0, i, 0));
                path.push(new BABYLON.Vector3(0, i, 0));
            }
            return path;
        };

        var nbL = canopies + 1;
        var nbS = height;
        var curve = curvePoints(nbS, nbL);

        var radiusFunction = function (i, distance) {
            var fact = 1;
            if (i % 2 == 0) { fact = .5; }
            var radius = (nbL * 2 - i - 1) * fact;
            return radius;
        };

        var particleSystem = new BABYLON.ParticleSystem("particles", 2000);
        particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png");
        var leaves = BABYLON.Mesh.CreateTube("tube", curve, 0, 20, radiusFunction, 1, scene);
        var trunk = BABYLON.Mesh.CreateCylinder("trunk", nbS / nbL, nbL * 1.5 - nbL / 2 - 1, nbL * 1.5 - nbL / 2 - 1, 120, 10, scene);

        leaves.material = leafMaterial;
        trunk.material = woodMaterial;
        var tree = new BABYLON.Mesh.CreateBox('', 5, scene);

        leaves.parent = tree;
        trunk.parent = tree;

        return tree;
    }

    let trees = [];
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 200, scene);
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);


    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 1.5;
    particleSystem.minLifeTime = 0.1;
    particleSystem.maxLifeTime = 0.4;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 10.0;
    //particleSystem.emitter = trees;
    particleSystem.emitRate = 1000;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.direction1 = new BABYLON.Vector3(-5, 10, 5);
    particleSystem.direction2 = new BABYLON.Vector3(5, 10, 5);
    particleSystem.color1 = new BABYLON.Color4(1, 1, 0, 1);
    particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
    particleSystem.canStart = false;

    /*
     // Colors of all particles RGBA
 particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
 particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
 particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

 particleSystem.emitRate = 100;

 // Set the gravity of all particles
 particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

 // Direction of each particle after it has been emitted
 particleSystem.direction1 = new BABYLON.Vector3(0, -1, 0);
 particleSystem.direction2 = new BABYLON.Vector3(0, -1, 0);

 particleSystem.minEmitPower = 6;
 particleSystem.maxEmitPower = 10;

  // Size of each particle (random between...
  particleSystem.minSize = 0.4;
  particleSystem.maxSize = 0.8;
*/

    // create 30 trees
    for (let i = 0; i < 30; i++) {
        let t = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
        t.parent = earth;
        trees.push(t);

    }

    positionEachTree(trees);



    moon.actionManager = new BABYLON.ActionManager(scene);

    // register an action for when the ball intesects a tree, so we need to iterate on each tree
    trees.forEach(tree => {
        moon.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: tree
            },
            () => {
                collision(particleSystem, moon, tree);
            }
        ));
    });

    return scene;
};
function removeAction(actionManager, a) {
    for (var i = actionManager.actions.length - 1; i >= 0; i--) {
        var action = actionManager.actions[i];
        if (action == a) {
            actionManager.actions.splice(i, 1);
        }
    }
}

function collision(particleSystem, moon, tree) {
    // il y a une collision, on supprime l'arbre
    // déclencher ici particules sur le tree

    // locate particle system at hit point in GLOBAL COORDINATE SYSTEM
    //const matrix = moon.computeWorldMatrix(true);
    //const global_position = BABYLON.Vector3.TransformCoordinates(moon.position, matrix);
    //particleSystem.emitter = global_position;
    particleSystem.emitter = moon.position;
    // start particle system
    if (particleSystem.canStart) {
        particleSystem.start();
        particleSystem.canStart = false;
    }

    // make it stop after 300ms
    setTimeout(() => {
        particleSystem.stop();
        particleSystem.canStart = true;
    }, 200);
    //particleSystem.start();
    tree.dispose();
    tree = null;

}
function positionEachTree(trees) {
    trees[0].position.y = 74;
    trees[0].position.x = -10;
    trees[0].position.z = -10;
    trees[0].rotation.z = 0.1;
    trees[0].rotation.x = -0.1;


    trees[1].position.y = 70;
    trees[1].position.x = 7;
    trees[1].position.z = -30;
    trees[1].rotation.z = -0.1;
    trees[1].rotation.x = -0.4;

    trees[2].position.y = 62;
    trees[2].position.x = -10;
    trees[2].position.z = -43;
    trees[2].rotation.z = 0.1;
    trees[2].rotation.x = -0.6;

    trees[3].position.y = 58;
    trees[3].position.z = -50;
    trees[3].rotation.x = -0.6;

    trees[4].position.y = 43;
    trees[4].position.x = 7;
    trees[4].position.z = -60;
    trees[4].rotation.z = -0.1;
    trees[4].rotation.x = -1;

    trees[5].position.y = 38;
    trees[5].position.x = -9;
    trees[5].position.z = -65;
    trees[5].rotation.z = 0.1;
    trees[5].rotation.x = -1;


    trees[6].position.y = 23;
    trees[6].position.x = 1;
    trees[6].position.z = -73;
    trees[6].rotation.x = -1.3;

    trees[7].position.y = 13;
    trees[7].position.x = -9;
    trees[7].position.z = -75;
    trees[7].rotation.x = -1.3;

    trees[8].position.y = 3;
    trees[8].position.x = 5;
    trees[8].position.z = -75;
    trees[8].rotation.x = -1.3;

    trees[9].position.y = -12;
    trees[9].position.x = -9;
    trees[9].position.z = -75;
    trees[9].rotation.z = 0.1;
    trees[9].rotation.x = -1.7;

    trees[10].position.y = -27;
    trees[10].position.x = 2;
    trees[10].position.z = -70;
    trees[10].rotation.x = -1.7;

    trees[11].position.y = -38;
    trees[11].position.x = 2;
    trees[11].position.z = -65;
    trees[11].rotation.x = -2;

    trees[12].position.y = -52;
    trees[12].position.x = 2;
    trees[12].position.z = -57;
    trees[12].rotation.x = -2.1;

    trees[13].position.y = -62;
    trees[13].position.x = -9;
    trees[13].position.z = -40;
    trees[13].rotation.x = -2.5;

    trees[14].position.y = 74;
    trees[14].position.x = -10;
    trees[14].position.z = 10;
    trees[14].rotation.z = 0.1;
    trees[14].rotation.x = 0.1;


    trees[15].position.y = 70;
    trees[15].position.x = 7;
    trees[15].position.z = 30;
    trees[15].rotation.z = -0.1;
    trees[15].rotation.x = 0.4;

    trees[16].position.y = 63;
    trees[16].position.x = -10;
    trees[16].position.z = 43;
    trees[16].rotation.z = 0.1;
    trees[16].rotation.x = 0.6;

    trees[17].position.y = 58;
    trees[17].position.z = 50;
    trees[17].rotation.x = 0.6;

    trees[18].position.y = 43;
    trees[18].position.x = 7;
    trees[18].position.z = 60;
    trees[18].rotation.z = -0.1;
    trees[18].rotation.x = 1;

    trees[19].position.y = 38;
    trees[19].position.x = -9;
    trees[19].position.z = 65;
    trees[19].rotation.z = 0.1;
    trees[19].rotation.x = 1;


    trees[20].position.y = 23;
    trees[20].position.x = 1;
    trees[20].position.z = 73;
    trees[20].rotation.x = 1.3;

    trees[21].position.y = 13;
    trees[21].position.x = -9;
    trees[21].position.z = 75;
    trees[21].rotation.x = 1.3;

    trees[22].position.y = 3;
    trees[22].position.x = 5;
    trees[22].position.z = 75;
    trees[22].rotation.x = 1.3;

    trees[23].position.y = -12;
    trees[23].position.x = -9;
    trees[23].position.z = 75;
    trees[23].rotation.z = 0.1;
    trees[23].rotation.x = 1.7;

    trees[24].position.y = -27;
    trees[24].position.x = 2;
    trees[24].position.z = 70;
    trees[24].rotation.x = 1.7;

    trees[25].position.y = -38;
    trees[25].position.x = 2;
    trees[25].position.z = 65;
    trees[25].rotation.x = 2;

    trees[26].position.y = -52;
    trees[26].position.x = 2;
    trees[26].position.z = 57;
    trees[26].rotation.x = 2.1;

    trees[27].position.y = -62;
    trees[27].position.x = 9;
    trees[27].position.z = 40;
    trees[27].rotation.x = 2.5;

    trees[28].position.y = -69;
    trees[28].position.x = 9;
    trees[28].position.z = 32;
    trees[28].rotation.x = 2.8;
}