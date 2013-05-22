RasterGL = function(containerId) {

    // Declaration of global Variables...
    rastergl = this;
    var container = document.getElementById(containerId);
    var renderer, camera, material, dicomData, directionalLight, mouseDown = false;
    var scene = new THREE.Scene();
    var geometry = new THREE.Geometry();

    this.loadCanvas = function (col){
        // Initialize Renderer...
        testCanvas = document.createElement('canvas');
        try {
            if (testCanvas.getContext('experimental-webgl')) {
                isWebGl = true;
                renderer = new THREE.WebGLRenderer({
                    antialias: true
                });
            } else {
                renderer = new THREE.CanvasRenderer();
            }
        } catch(e) {
            renderer = new THREE.CanvasRenderer();
        }
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.backgroundColor = '#000000';
        container.appendChild(renderer.domElement);
        
        // Initialize Camera...
        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 600;
        scene.add(camera);
                
        controls = new THREE.TrackballControls(camera);
        controls.rotateSpeed = 3.0;
        controls.zoomSpeed = 2.0;
        controls.panSpeed = 2.0;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        // Initialize material...
        if(col>0){
            material = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                shading: THREE.FlatShading
            });
        }else{
            material = new THREE.MeshLambertMaterial({
                color: 0xff7c7c,
                shading: THREE.FlatShading
            });
        }
        
        // Event Handler for Basic Mouse processes...
        renderer.domElement.addEventListener('mousemove', rastergl.mouseMoveAction, false);        
        renderer.domElement.addEventListener('mousedown', rastergl.mouseDownAction, false);
        renderer.domElement.addEventListener('mouseup', rastergl.mouseUpAction, false);
        
        // Event Handler for Mouse Wheel scrolling...
        renderer.domElement.addEventListener('DOMMouseScroll', rastergl.mouseScrollAction, false);
        renderer.domElement.addEventListener('mousewheel', rastergl.mouseScrollAction, false);
    }

    this.loadDicomObject = function (data, col){
        // 3D Data...
        var jsonArray = data;
        for (var i = 0; i < jsonArray[0].length; i++) {
            geometry.vertices.push(new THREE.Vector3(jsonArray[0][i][0], jsonArray[0][i][1], jsonArray[0][i][2]));
        }
        for (i = 0; i < jsonArray[1].length; i++) {
            geometry.faces.push(new THREE.Face3(jsonArray[1][i][0], jsonArray[1][i][1], jsonArray[1][i][2]));
        }
        geometry.computeCentroids();
        geometry.computeFaceNormals();
        THREE.GeometryUtils.center(geometry); // Center the object...
        
        dicomData = new THREE.Mesh(geometry, material);
        scene.add(dicomData);
        
        // add ambient lighting...
        var ambientLight = new THREE.AmbientLight(0x555555);
        scene.add(ambientLight);
        
        directionalLight = new THREE.DirectionalLight(0xAAAAAA);
        directionalLight.position.set(200, 200, 1000).normalize();
        camera.add(directionalLight);
        camera.add(directionalLight.target);

        controls.update();
        renderer.render(scene, camera);
    }

    // Mouse Down Event...
    this.mouseDownAction = function(event) {
        event.preventDefault();
        mouseDown = true;
    }

    // Mouse Move Event...
    this.mouseMoveAction = function(event) {
        event.preventDefault();
        if (mouseDown){
            if(dicomData!=null) {
                controls.update();
                renderer.render(scene, camera);
            }
        }
    }

    // Mouse Up Event...
    this.mouseUpAction = function(event) {
        event.preventDefault();
        controls.enabled = true;
        if (mouseDown) {
            mouseDown = false;            
        }
    }
    
    // Mouse Scroll Event...
    this.mouseScrollAction = function (event) {
        event.preventDefault();
        if(dicomData!=null){
            var rolled = 0;
            if (event.wheelDelta === undefined) {
                // Firefox - The measurement units of the detail and wheelDelta properties are different...
                rolled = -40 * event.detail;
            } else {
                rolled = event.wheelDelta;
            }
            if (rolled > 0) { //Up
                camera.translateZ(5);
            } else { //Down
                camera.translateZ(-5);
            }
            renderer.render(scene, camera);
        }
    }
}