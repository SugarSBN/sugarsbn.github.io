/*
 * @Author: SuBonan
 * @Date: 2023-01-11 10:52:37
 * @LastEditTime: 2023-01-18 17:29:08
 * @FilePath: \shadow\main.js
 * @Github: https://github.com/SugarSBN
 * これなに、これなに、これない、これなに、これなに、これなに、ねこ！ヾ(*´∀｀*)ﾉ
 */
"use strict";

var index = 0;

var projectionMatrix;
var axis = 0;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = vec3(0, 0, 0);
var dTheta = 5.0;

var flag = true;

var program, shadowProgram;
var canvas, render, gl;

var nInstances;
var iTranslate = [];
var iRotate = [];
var iScale = [];
var modelLeftMoving = false;
var modelRightMoving = false;
var modelUpMoving = false;
var modelDownMoving = false;
var modelSpaceMoving = false;
var modelOneMoving = false;
var lightPosition = vec4(0.0, 10.0, 0.0, 1.0);

var animate = false;
var animateT = [];
var animateR = [];
var animateS = [];
var animateFrame = 0;
var nFrames = 0;

onload = function init(){
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { this.alert("WebGL 2.0 isn't available"); }
    
    this.alert("Instruction:\n1. Use W, A, S, D, 1, Space to move the camera.\n2. Use Shift + W, A, S, D, 1, Space to move the model.\n3. Use Shift + Mouse move (button held), arrow keys, scroll to change model's pose.\n4. Move the mouse with button held to change the viewing.\n5. Press R to leave an instance of the model.\n6. Press T to delete an instance of the model.\n7. When the number of instances is greater than 3, then press O to see the animation based on Slerp and 3-times Bezier.\n8. Press O to stop the animation.\n9. When the animation is on, use scroll to control the speed of animation.\n10. The console is logging the current FPS.\n Let meow~ be full of your screen!!!");

    gl.clearColor(0.1, 0.15, 0.15, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    shadowProgram = initShaders(gl, "shadow-vertex-shader", "shadow-fragment-shader");
    
    fbo = initFramebufferObject(gl);

    nInstances = 1;
    iTranslate = [vec3(0, 0, 0)];
    iRotate = [quaternion(0, vec3(0, 1, 0))];
    iScale = [vec3(1, 1, 1)];

    //开启0号纹理缓冲区并绑定帧缓冲区对象的纹理
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
    
    initPoints();

    drawOBJ();

}


var points = [];
var normals = [];

var initPoints = function(){
    index = 0;
    for (var i = 0;i < obj_numSurfaces * 3;i += 3){
        var p1 = obj_vertices[obj_surfaces[i] - 1];
        var p2 = obj_vertices[obj_surfaces[i + 1] - 1];
        var p3 = obj_vertices[obj_surfaces[i + 2] - 1];
        
        p1 = vec4(p1[0], p1[1], p1[2], 1.0);
        p2 = vec4(p2[0], p2[1], p2[2], 1.0);
        p3 = vec4(p3[0], p3[1], p3[2], 1.0);
        var n1 = obj_vertices[obj_surfaces[i] - 1];
        var n2 = obj_vertices[obj_surfaces[i + 1] - 1];
        var n3 = obj_vertices[obj_surfaces[i + 2] - 1];
        n1 = normalize(vec4(n1[0], n1[1], n1[2], 0.0));
        n2 = normalize(vec4(n2[0], n2[1], n2[2], 0.0));
        n3 = normalize(vec4(n3[0], n3[1], n3[2], 0.0));
        
        points.push(p1);
        normals.push(n1);
        
        points.push(p2);
        normals.push(n2);

        points.push(p3);
        normals.push(n3);
        
        index += 3;
    }
    
    roundPoints();
}


var prepareOBJ = function(){
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(program);
    
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
    var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
    var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

    var materialAmbient = vec4(0.7, 0.0, 0.7, 1.0);
    var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
    var materialSpecular = vec4(0.7, 0.7, 0.7, 1.0);
    var materialShininess = 10.0;
    lightPoints(lightPosition);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);
    
    var aspect = window.innerHeight / window.innerWidth;
    projectionMatrix = perspective(45.0, 1.0 / aspect, 0.1, 100.0);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), specularProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), lightPosition);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}

var fbo;
var prepareShadow = function(){
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shadowProgram);
    
    var aspect = window.innerHeight / window.innerWidth;
    projectionMatrix = perspective(45.0, 1.0 / aspect, 0.1, 100.0);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    var positionLoc = gl.getAttribLocation(shadowProgram, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

}

var drawOBJ = function(){
    
    prepareShadow();

    prepareOBJ();

    renderOBJ();
}

var cameraSpeed = 0.05;
var modelSpeed = 0.05;

var drawOBJonce = function(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1i(gl.getUniformLocation(program, "u_ShadowMap"), 0.0);
    var fromLight = lookAt(vec3(lightPosition[0], lightPosition[1], lightPosition[2]), vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0));
    var projectionLight = perspective(150.0, 1.0, 0.1, 100.0);

    for (var i = 0;i < nInstances;i++){
        var modelMatrix = scale(iScale[i][0], iScale[i][1], iScale[i][2]);
        modelMatrix = mult(toMatrix(iRotate[i]), modelMatrix);
        modelMatrix = mult(translate(iTranslate[i][0], iTranslate[i][1], iTranslate[i][2]), modelMatrix);

        gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(modelMatrix));

        var viewMatrix = lookAt(cameraPos, add(cameraPos, cameraFront), cameraUp);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, flatten(viewMatrix));
        
        
        gl.uniform1i(gl.getUniformLocation(program, "is_shadowed"), 0);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_MvpMatrix"), false, flatten(mult(projectionLight, mult(fromLight, modelMatrix))));
        gl.drawArrays(gl.TRIANGLES, 0, index);
        
        
    }
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_MvpMatrix"), false, flatten(mult(projectionLight, fromLight)));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(mat4()));
    gl.uniform1i(gl.getUniformLocation(program, "is_shadowed"), 1);
    gl.drawArrays(gl.TRIANGLES, index, 12);
    gl.drawArrays(gl.TRIANGLES, index + 12, 60);
    //gl.drawArrays(gl.LINE_LOOP, 0, index);
    if (animate) {
        animateFrame += 1;
        if (animateFrame >= nFrames) animateFrame = 0;
        var modelMatrix = scale(animateS[animateFrame][0], animateS[animateFrame][1], animateS[animateFrame][2]);
        modelMatrix = mult(toMatrix(animateR[animateFrame]), modelMatrix);
        modelMatrix = mult(translate(animateT[animateFrame][0], animateT[animateFrame][1], animateT[animateFrame][2]), modelMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(modelMatrix));
        gl.uniform1i(gl.getUniformLocation(program, "is_shadowed"), 0);
        gl.drawArrays(gl.TRIANGLES, 0, index);
    }
}

var drawShadowOnce = function(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var viewMatrix = lookAt(vec3(lightPosition[0], lightPosition[1], lightPosition[2]), vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0));
    var projectionLight = perspective(150.0, 1.0, 0.1, 100.0);
    
    for (var i = 0;i < nInstances;i++){
        var modelMatrix = scale(iScale[i][0], iScale[i][1], iScale[i][2]);
        modelMatrix = mult(toMatrix(iRotate[i]), modelMatrix);
        modelMatrix = mult(translate(iTranslate[i][0], iTranslate[i][1], iTranslate[i][2]), modelMatrix);
        
        gl.uniformMatrix4fv(gl.getUniformLocation(shadowProgram, "u_MvpMatrix"), false, flatten(mult(projectionLight, mult(viewMatrix, modelMatrix))));

        gl.drawArrays(gl.TRIANGLES, 0, index);
    }
    if (animate) {
        var modelMatrix = scale(animateS[animateFrame][0], animateS[animateFrame][1], animateS[animateFrame][2]);
        modelMatrix = mult(toMatrix(animateR[animateFrame]), modelMatrix);
        modelMatrix = mult(translate(animateT[animateFrame][0], animateT[animateFrame][1], animateT[animateFrame][2]), modelMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(modelMatrix));
        gl.uniformMatrix4fv(gl.getUniformLocation(shadowProgram, "u_MvpMatrix"), false, flatten(mult(projectionLight, mult(viewMatrix, modelMatrix))));
        gl.drawArrays(gl.TRIANGLES, 0, index);
    }
    //gl.drawArrays(gl.TRIANGLES, index, 12);
    //gl.drawArrays(gl.TRIANGLES, index + 12, 60);
    //gl.drawArrays(gl.LINE_LOOP, 0, index);
}

var then = 0;
var renderOBJ = function(now){
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    console.log(1 / deltaTime);

    if (modelLeftMoving)  iTranslate[0] = add(mult(modelSpeed, normalize(cross(cameraUp, cameraFront))), iTranslate[0]);
    if (modelRightMoving) iTranslate[0] = subtract(iTranslate[0], mult(modelSpeed, normalize(cross(cameraUp, cameraFront))));
    if (modelUpMoving)    iTranslate[0] = add(mult(modelSpeed, normalize(cameraFront)), iTranslate[0]);
    if (modelDownMoving)  iTranslate[0] = subtract(iTranslate[0], mult(modelSpeed, normalize(cameraFront)));
    if (modelSpaceMoving) iTranslate[0] = add(mult(modelSpeed, normalize(cameraUp)), iTranslate[0]);
    if (modelOneMoving)   iTranslate[0] = subtract(iTranslate[0], mult(modelSpeed, normalize(cameraUp)));
    if (iTranslate[0][1] < 0) iTranslate[0][1] = 0;
    if (iTranslate[0][0] > 30) iTranslate[0][0] = 30;
    if (iTranslate[0][0] < -30) iTranslate[0][0] = -30;
    if (iTranslate[0][2] > 30) iTranslate[0][2] = 30;
    if (iTranslate[0][2] < -30) iTranslate[0][2] = -30;

    if (leftMoving)  cameraPos = subtract(cameraPos, mult(cameraSpeed, normalize(cross(cameraFront, cameraUp))));
    if (upMoving)    cameraPos = add(cameraPos, mult(cameraSpeed, cameraFront));
    if (rightMoving) cameraPos = add(cameraPos, mult(cameraSpeed, normalize(cross(cameraFront, cameraUp))));
    if (downMoving)  cameraPos = subtract(cameraPos, mult(cameraSpeed, cameraFront));
    if (spaceMoving) cameraPos = add(cameraPos, mult(cameraSpeed, cameraUp));
    if (oneMoving)   cameraPos = subtract(cameraPos, mult(cameraSpeed, cameraUp));
    if (cameraPos[1] < 1) cameraPos[1] = 1;
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shadowProgram);
    drawShadowOnce();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(program);
    
    drawOBJonce();
    
    requestAnimationFrame(renderOBJ);
}

function initFramebufferObject(gl) {
    var framebuffer, texture, depthBuffer;
    //定义错误函数
    function error() {
       if (framebuffer) gl.deleteFramebuffer(framebuffer);
       if (texture) gl.deleteFramebuffer(texture);
       if (depthBuffer) gl.deleteFramebuffer(depthBuffer);
       return null;
    }
    //创建帧缓冲区对象
    framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
       console.log("无法创建帧缓冲区对象");
       return error();
    }
    //创建纹理对象并设置其尺寸和参数
    texture = gl.createTexture();
    if (!texture) {
       console.log("无法创建纹理对象");
       return error();
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth, window.innerHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    framebuffer.texture = texture;//将纹理对象存入framebuffer
    //创建渲染缓冲区对象并设置其尺寸和参数
    depthBuffer = gl.createRenderbuffer();
    if (!depthBuffer) {
       console.log("无法创建渲染缓冲区对象");
       return error();
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, window.innerWidth, window.innerHeight);
    //将纹理和渲染缓冲区对象关联到帧缓冲区对象上
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
    //检查帧缓冲区对象是否被正确设置
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
       console.log("渲染缓冲区设置错误" + e.toString());
       return error();
    }
    //取消当前的focus对象
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    return framebuffer;
 }