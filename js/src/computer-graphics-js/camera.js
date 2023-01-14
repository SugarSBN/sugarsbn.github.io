/*
 * @Author: SuBonan
 * @Date: 2023-01-13 19:08:08
 * @LastEditTime: 2023-01-14 18:56:50
 * @FilePath: \learnopengl\camera.js
 * @Github: https://github.com/SugarSBN
 * これなに、これなに、これない、これなに、これなに、これなに、ねこ！ヾ(*´∀｀*)ﾉ
 */


var cameraPos = vec3(0.0, 0.0, 3.0);
var cameraFront = vec3(0.0, 0.0, -1.0);
var cameraUp = vec3(0.0, 1.0, 0.0);
var yaw = -90.0;
var pitch = 0.0;

window.onkeydown = function(event){
    if (event.shiftKey == 1) firstMouse = false;
    var cameraSpeed = 0.5;
    switch(event.keyCode){
        case 65: // "<-"
            cameraPos = subtract(cameraPos, mult(cameraSpeed, normalize(cross(cameraFront, cameraUp))));
            break;
        case 87: // "^"
            cameraPos = add(cameraPos, mult(cameraSpeed, cameraFront));
            break;
        case 68: // "->"
            cameraPos = add(cameraPos, mult(cameraSpeed, normalize(cross(cameraFront, cameraUp))));
            break;
        case 83: // "v"
            cameraPos = subtract(cameraPos, mult(cameraSpeed, cameraFront));
            break;
        case 32:
            cameraPos = add(cameraPos, mult(cameraSpeed, cameraUp));
            break;
        case 49:
            cameraPos = subtract(cameraPos, mult(cameraSpeed, cameraUp));
            break;
        
    }
}

var firstMouse = false;
var lastX, lastY;
window.onmousemove = function (event) {
    if (event.buttons == 0) {
        firstMouse = false;
        return;
    }
    if (!firstMouse) {
        firstMouse = true;
        lastX = event.clientX;
        lastY = event.clientY;
        return;
    }
    var xoffset = event.clientX - lastX;
    var yoffset = lastY - event.clientY;
    lastX = event.clientX;
    lastY = event.clientY;
    xoffset *= 0.1;
    yoffset *= 0.1;
    
    yaw -= xoffset;
    pitch -= yoffset;

    if(pitch > 89.0)
        pitch = 89.0;
    if(pitch < -89.0)
        pitch = -89.0;

    var f = vec3(
        Math.cos(radians(yaw)) * Math.cos(radians(pitch)),
        Math.sin(radians(pitch)),
        Math.sin(radians(yaw)) * Math.cos(radians(pitch)));
    cameraFront = normalize(f);
}