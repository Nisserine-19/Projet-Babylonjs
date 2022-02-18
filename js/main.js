var canvas;
var engine = null;
var scene = null;
var sceneToRender = null;

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
            sceneToRender.render();
        }
    });
    
    scene = createScene();
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

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/space", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.001;
    scene.fogColor = new BABYLON.Color3(0, 0, 0);




    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.setPosition(new BABYLON.Vector3(0, 220, 100));

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
        earth.rotation.x += 0.005;
        moon.rotation.x+=-0.02;
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

        var leaves = BABYLON.Mesh.CreateTube("tube", curve, 0, 10, radiusFunction, 1, scene);
        var trunk = BABYLON.Mesh.CreateCylinder("trunk", nbS / nbL, nbL * 1.5 - nbL / 2 - 1, nbL * 1.5 - nbL / 2 - 1, 12, 1, scene);

        leaves.material = leafMaterial;
        trunk.material = woodMaterial;
        var tree = new BABYLON.Mesh.CreateBox('', 1, scene);
        tree.isVisible = false;
        leaves.parent = tree;
        trunk.parent = tree;
        return tree;
    }

    var tree = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree2 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree3 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree4 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree5 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree6 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree7 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree8 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree9 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree10 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree11 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree12 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree13 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree14 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree15 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree16 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree17 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree18 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree19 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree20 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree21 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree22 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree23 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree24 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree25 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree26 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree27 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree28 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);
    var tree29 = simplePineGenerator(3, 15, woodMaterial, leafMaterial);


    tree.position.y = 74;
    tree.position.x = -10;
    tree.position.z = -10;
    tree.rotation.z = 0.1;
    tree.rotation.x = -0.1;


    tree2.position.y = 70;
    tree2.position.x = 7;
    tree2.position.z = -30;
    tree2.rotation.z = -0.1;
    tree2.rotation.x = -0.4;

    tree3.position.y = 62;
    tree3.position.x = -10;
    tree3.position.z = -43;
    tree3.rotation.z = 0.1;
    tree3.rotation.x = -0.6;

    tree4.position.y = 58;
    tree4.position.z = -50;
    tree4.rotation.x = -0.6;

    tree5.position.y = 43;
    tree5.position.x = 7;
    tree5.position.z = -60;
    tree5.rotation.z = -0.1;
    tree5.rotation.x = -1;

    tree6.position.y = 38;
    tree6.position.x = -9;
    tree6.position.z = -65;
    tree6.rotation.z = 0.1;
    tree6.rotation.x = -1;


    tree7.position.y = 23;
    tree7.position.x = 1;
    tree7.position.z = -73;
    tree7.rotation.x = -1.3;

    tree8.position.y = 13;
    tree8.position.x = -9;
    tree8.position.z = -75;
    tree8.rotation.x = -1.3;

    tree9.position.y = 3;
    tree9.position.x = 5;
    tree9.position.z = -75;
    tree9.rotation.x = -1.3;

    tree10.position.y = -12;
    tree10.position.x = -9;
    tree10.position.z = -75;
    tree10.rotation.z = 0.1;
    tree10.rotation.x = -1.7;

    tree11.position.y = -27;
    tree11.position.x = 2;
    tree11.position.z = -70;
    tree11.rotation.x = -1.7;

    tree12.position.y = -38;
    tree12.position.x = 2;
    tree12.position.z = -65;
    tree12.rotation.x = -2;

    tree13.position.y = -52;
    tree13.position.x = 2;
    tree13.position.z = -57;
    tree13.rotation.x = -2.1;

    tree14.position.y = -62;
    tree14.position.x = -9;
    tree14.position.z = -40;
    tree14.rotation.x = -2.5;

    tree15.position.y = 74;
    tree15.position.x = -10;
    tree15.position.z = 10;
    tree15.rotation.z = 0.1;
    tree15.rotation.x = 0.1;


    tree16.position.y = 70;
    tree16.position.x = 7;
    tree16.position.z = 30;
    tree16.rotation.z = -0.1;
    tree16.rotation.x = 0.4;

    tree17.position.y = 63;
    tree17.position.x = -10;
    tree17.position.z = 43;
    tree17.rotation.z = 0.1;
    tree17.rotation.x = 0.6;

    tree18.position.y = 58;
    tree18.position.z = 50;
    tree18.rotation.x = 0.6;

    tree19.position.y = 43;
    tree19.position.x = 7;
    tree19.position.z = 60;
    tree19.rotation.z = -0.1;
    tree19.rotation.x = 1;

    tree20.position.y = 38;
    tree20.position.x = -9;
    tree20.position.z = 65;
    tree20.rotation.z = 0.1;
    tree20.rotation.x = 1;


    tree21.position.y = 23;
    tree21.position.x = 1;
    tree21.position.z = 73;
    tree21.rotation.x = 1.3;

    tree22.position.y = 13;
    tree22.position.x = -9;
    tree22.position.z = 75;
    tree22.rotation.x = 1.3;

    tree23.position.y = 3;
    tree23.position.x = 5;
    tree23.position.z = 75;
    tree23.rotation.x = 1.3;

    tree24.position.y = -12;
    tree24.position.x = -9;
    tree24.position.z = 75;
    tree24.rotation.z = 0.1;
    tree24.rotation.x = 1.7;

    tree25.position.y = -27;
    tree25.position.x = 2;
    tree25.position.z = 70;
    tree25.rotation.x = 1.7;

    tree26.position.y = -38;
    tree26.position.x = 2;
    tree26.position.z = 65;
    tree26.rotation.x = 2;

    tree27.position.y = -52;
    tree27.position.x = 2;
    tree27.position.z = 57;
    tree27.rotation.x = 2.1;

    tree28.position.y = -62;
    tree28.position.x = 9;
    tree28.position.z = 40;
    tree28.rotation.x = 2.5;

    tree29.position.y = -69;
    tree29.position.x = 9;
    tree29.position.z = 32;
    tree29.rotation.x = 2.8;

    tree.parent = earth;
    tree2.parent = earth;
    tree3.parent = earth;
    tree4.parent = earth;
    tree5.parent = earth;
    tree6.parent = earth;
    tree7.parent = earth;
    tree8.parent = earth;
    tree9.parent = earth;
    tree10.parent = earth;
    tree11.parent = earth;
    tree12.parent = earth;
    tree13.parent = earth;
    tree14.parent = earth;
    tree15.parent = earth;
    tree16.parent = earth;
    tree17.parent = earth;
    tree18.parent = earth;
    tree19.parent = earth;
    tree20.parent = earth;
    tree21.parent = earth;
    tree22.parent = earth;
    tree23.parent = earth;
    tree24.parent = earth;
    tree25.parent = earth;
    tree26.parent = earth;
    tree27.parent = earth;
    tree28.parent = earth;
    tree29.parent = earth;


    return scene;

};
