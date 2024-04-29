
const VSHADER_SOURCE = `attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
const FSHADER_SOURCE = `precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let canvas, gl, a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotateMatrix;
let color = [1, 0, 0, 1];
let g_globalAngleY = 0
let g_globalAngleX = 0
let g_globalScale = 0.6
let g_yellowAngleZ = 0
let g_blueAngleX = 0
let g_yellowAngleX = 0
let g_blueAngleY = 0

let g_legAngleX = 5
let g_legAngleZ = 0
let g_calfAngleX = 0
let g_calfAngleY = 0

let g_startTime = performance.now() / 1000
let g_seconds = 0
let g_timeSpeed = 3
let g_isAnimationRunning = 1
let isDragging = false;
let prevMouseX, prevMouseY;


const setupWebGL = () => {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

};

const connectVariablesToGLSL = () => {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }


    var identityM = new Matrix4()
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements)

};

const renderScene = () => {
    let startTime = performance.now()
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let globalRotMat = new Matrix4()
        .rotate(g_globalAngleX, 1, 0, 0)
        .rotate(g_globalAngleY, 0, 1, 0)
        .scale(g_globalScale, g_globalScale, g_globalScale)
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

    //body
    let body = new Cube();
    body.color = [1, 0, 0, 1]
    body.matrix.translate(-.35, -.5, 0)
        .scale(.7, 1, .5)
    body.render()

    //left arm
    let leftArm = new Cube();
    leftArm.color = [1, 1, 0, 1]
    leftArm.matrix.translate(0.35, .5, .125)
        .rotate(g_yellowAngleZ, 0, 0, 1)
        .rotate(g_yellowAngleX, 1, 0, 0)
        .scale(.25, -.7, .25)
    leftArm.render()

    //right arm
    let rightArm = new Cube();
    rightArm.color = [1, 1, 0, 1]
    rightArm.matrix.translate(-0.35, .5, .125)
        .rotate(-g_yellowAngleZ, 0, 0, 1)
        .rotate(g_yellowAngleX, 0, 1, 0)
        .scale(-.25, -.7, .25)
    rightArm.render()

    //left hand
    let leftHand = new Cube();
    leftHand.color = [0, 0, 1, 1]
    leftHand.matrix = leftArm.matrix
    leftHand.matrix.translate(0, 1, 0)
        .scale(1, 0.2, 1)
        .rotate(-g_blueAngleX, 1, 0, 0)
        .rotate(g_blueAngleY, 1, 1, 0)
    leftHand.render()

    //right hand
    let rightHand = new Cube();
    rightHand.color = [0, 0, 1, 1]
    rightHand.matrix = rightArm.matrix
    rightHand.matrix.translate(0, 1, 0)
        .scale(1, 0.2, 1)
        .rotate(-g_blueAngleX, 1, 0, 0)
        .rotate(g_blueAngleY, 0, 1, 0)
    rightHand.render()

    //head
    let head = new Cube();
    head.color = [0, 0, 1, 1]
    head.matrix.translate(-.25, .5, 0.05)
        .scale(.5, .5, .4)

    head.render()

    // left leg

    let leftLeg = new Cube()
    leftLeg.color = [1, 0, 1, 1]
    leftLeg.matrix.translate(.05, -.5, .125)
        .rotate(g_legAngleX, 1, 0, 0)
        .rotate(g_legAngleZ, 0, 0, 1)
        .scale(.25, -.5, .25)

    leftLeg.render()

    // right leg

    let rightLeg = new Cube()
    rightLeg.color = [1, 0, 1, 1]
    rightLeg.matrix.translate(-.05, -.5, .125)
        .rotate(-g_legAngleX, 1, 0, 0)
        .rotate(-g_legAngleZ, 0, 0, 1)
        .scale(-.25, -.5, .25)

    rightLeg.render()

    // left calf

    let leftCalf = new Cube()
    leftCalf.color = [1, 1, 1, 1]
    leftCalf.matrix = leftLeg.matrix
    leftCalf.matrix
        .translate(0, 1, 1)
        .scale(1, 1, -1)
        .rotate(g_calfAngleX, 1, 0, 0)
    leftCalf.render()

    // // right calf

    let rightCalf = new Cube()
    rightCalf.color = [1, 1, 1, 1]
    rightCalf.matrix = rightLeg.matrix
    rightCalf.matrix
        .translate(0, 1, 1)
        .rotate(-g_calfAngleX, 1, 0, 0)
        .scale(1, 1, -1)

    rightCalf.render()


    //right foot
    let rightFoot = new Cube()
    rightFoot.color = [0.5, 0.75, 0, 1]
    rightFoot.matrix = rightCalf.matrix
    rightFoot.matrix.scale(1, .2, 2)
        .translate(0, 5, 0)


    rightFoot.render()


    //left foot
    let leftFoot = new Cube()
    leftFoot.color = [0.5, 0.75, 0, 1]
    leftFoot.matrix = leftCalf.matrix
    leftFoot.matrix.scale(1, .2, 2)
        .translate(0, 5, 0)


    leftFoot.render()


    duration = performance.now() - startTime
    document.getElementById('performance').innerHTML = `${duration.toFixed(2)}ms ${Math.floor(1000 / duration)}fps`

};

const updateAnimationAngles = () => {
    if (!g_isAnimationRunning) return

    // walking
    if (g_isAnimationRunning === 1) {
        g_yellowAngleZ = Math.min(Math.max(0, g_yellowAngleZ + Math.sin(g_seconds * g_timeSpeed) / 5), 20)
        g_yellowAngleX = Math.cos(g_seconds * g_timeSpeed / 2) * 5
        g_legAngleX = Math.cos(g_seconds * g_timeSpeed / 2) * 20
        g_calfAngleX = (Math.cos(g_seconds * g_timeSpeed / 2) - Math.PI / 3) * 10
        g_legAngleZ = 0
    }

    // flalling
    if (g_isAnimationRunning === 2) {
        g_yellowAngleZ = 120 + Math.sin(g_seconds * g_timeSpeed * 5) * 10
        g_yellowAngleX = Math.sin(g_seconds * g_timeSpeed * 5) * 20

        g_legAngleX = Math.cos(g_seconds * g_timeSpeed * 5) * 20
        g_legAngleZ = Math.cos(g_seconds * g_timeSpeed * 2) * 5
        g_calfAngleX = (Math.cos(g_seconds * g_timeSpeed * 5) - Math.PI / 3) * 20



    }
}

const tick = () => {
    g_seconds = performance.now() / 1000 - g_startTime
    updateAnimationAngles()
    renderScene()

    requestAnimationFrame(tick)

}


const click = (e) => {
    if (!isDragging) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    } else {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;

        // Calculate rotation angles based on mouse movement
        const rotationSpeed = .5; // Adjust this value to control the rotation speed
        const rotationY = deltaX * -rotationSpeed;
        const rotationX = deltaY * -rotationSpeed;

        g_globalAngleY += rotationY
        g_globalAngleX += rotationX

        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    }
};



const makeEventListeners = () => {

    const handleMouseWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.1 : 0.9;

        g_globalScale = g_globalScale * delta

        // globalRotMat.scale(delta, delta, delta);

        // gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    };
    const handleMouseDrag = (e) => {
        if (e.buttons === 1) {
            click(e);
        }
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    };

    const handleCameraYAngleChange = (e) => {
        if (g_globalAngleY === parseInt(e.target.value))
            return
        g_globalAngleY = parseInt(e.target.value)
        renderScene();
    }

    const handleYellowAngleChange = (e) => {
        if (g_yellowAngleZ === parseInt(e.target.value))
            return
        g_yellowAngleZ = parseInt(e.target.value)
        renderScene()
    }

    const handleBlueChange = (e) => {
        if (g_blueAngleX === parseInt(e.target.value))
            return
        g_blueAngleX = parseInt(e.target.value)
        renderScene()
    }

    const handleAnimationChange = (e) => {
        g_isAnimationRunning = g_isAnimationRunning === 1 ? 2 : 1
    }

    const enableAnimation = () => g_isAnimationRunning = 1
    const disableAnimation = () => g_isAnimationRunning = 0

    // canvas.onmousedown = handleMouseDown;
    // canvas.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseDrag;
    canvas.onwheel = handleMouseWheel

    canvas.onclick = handleAnimationChange;


    document.getElementById('enable-animation').onclick = enableAnimation
    document.getElementById('disable-animation').onclick = disableAnimation

    document.getElementById('camera-angle').onmousemove = handleCameraYAngleChange;
    document.getElementById('yellow-angle').onmousemove = handleYellowAngleChange;
    document.getElementById('blue-angle').onmousemove = handleBlueChange;
};

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    makeEventListeners();
    tick()
    //renderScene()
}
