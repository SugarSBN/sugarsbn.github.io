/*
 * @Author: SuBonan
 * @Date: 2023-01-11 10:52:37
 * @LastEditTime: 2023-01-14 19:06:49
 * @FilePath: \learnopengl\main.js
 * @Github: https://github.com/SugarSBN
 * これなに、これなに、これない、これなに、これなに、これなに、ねこ！ヾ(*´∀｀*)ﾉ
 */
"use strict";

var index = 0;

var modelViewMatrix = [];
var projectionMatrix = [];
var translateVector = [];

var axis = 0;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = vec3(0, 0, 0);
var dTheta = 5.0;

var flag = true;

var program;
var canvas, render, gl;

var bezier = function(u){
    var b = [];
    var a = 1 - u;
    b.push(u * u * u);
    b.push(3 * a * u * u);
    b.push(3 * a * a * u);
    b.push(a * a * a);
    return b;
}

onload = function init(){
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { this.alert("WebGL 2.0 isn't available"); }



    gl.clearColor(0.2, 0.3, 0.3, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    drawOBJ();

}




// draw OBJ ===========================================

var drawOBJ = function(){
    var points = [];
    var normals = [];
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

    var lightPosition = vec4(10.0, 10.0, 0.0, 0.0);
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
    var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
    var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

    var materialAmbient = vec4(0.8, 0.0, 0.8, 1.0);
    var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
    var materialSpecular = vec4(0.3, 0.3, 0.3, 1.0);
    var materialShininess = 10.0;
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), specularProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), lightPosition);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    translateVector = [-2.0, -2.0, 0];
    
    renderOBJ();
}

var tmp = 0;
var renderOBJ = function(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    tmp += 0.5;

    var thetas = [
        0+180+tmp,
        45+180+tmp,
        90+180+tmp,
        135+180+tmp,
        180+180+tmp,
        225+180+tmp,
        270+180+tmp,
        315+180+tmp
    ]
    var translates = [
        translate(5 * Math.cos(radians(tmp)), 0, 5 * Math.sin(radians(tmp))),
        translate(5 * Math.cos(radians(tmp + 45)), 0, 5 * Math.sin(radians(tmp + 45))),
        translate(5 * Math.cos(radians(tmp + 90)), 0, 5 * Math.sin(radians(tmp + 90))),
        translate(5 * Math.cos(radians(tmp + 135)), 0, 5 * Math.sin(radians(tmp + 135))),
        translate(5 * Math.cos(radians(tmp + 180)), 0, 5 * Math.sin(radians(tmp + 180))),
        translate(5 * Math.cos(radians(tmp + 225)), 0, 5 * Math.sin(radians(tmp + 225))),
        translate(5 * Math.cos(radians(tmp + 270)), 0, 5 * Math.sin(radians(tmp + 270))),
        translate(5 * Math.cos(radians(tmp + 315)), 0, 5 * Math.sin(radians(tmp + 315)))
    ];
    for (var i = 0;i < 8;i++){
        var modelMatrix = rotate(thetas[i], [0, 1, 0]);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(modelMatrix));

        var viewMatrix = mult(lookAt(cameraPos, add(cameraPos, cameraFront), cameraUp), translates[i]);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, flatten(viewMatrix));

        
        gl.drawArrays(gl.TRIANGLES, 0, index);
    }
    //gl.drawArrays(gl.LINE_LOOP, 0, index);

    
    requestAnimationFrame(renderOBJ);
}

