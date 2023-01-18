/*
 * @Author: SuBonan
 * @Date: 2023-01-13 19:08:08
 * @LastEditTime: 2023-01-18 17:14:13
 * @FilePath: \shadow\camera.js
 * @Github: https://github.com/SugarSBN
 * これなに、これなに、これない、これなに、これなに、これなに、ねこ！ヾ(*´∀｀*)ﾉ
 */


var cameraPos = vec3(0.0, 0.0, 3.0);
var cameraFront = vec3(0.0, 0.0, -1.0);
var cameraUp = vec3(0.0, 1.0, 0.0);
var yaw = -90.0;
var pitch = 0.0;

var leftMoving = false;
var rightMoving = false;
var upMoving = false;
var downMoving = false;
var spaceMoving = false;
var oneMoving = false;

window.onkeyup = function (event){
    modelLeftMoving = false;
    modelRightMoving = false;
    modelUpMoving = false;
    modelDownMoving = false;
    modelSpaceMoving = false;
    modelOneMoving = false;

    switch(event.keyCode){
        case 65: // "<-"
            leftMoving = false;
            break;
        case 87: // "^"
            upMoving = false;
            break;
        case 68: // "->"
            rightMoving = false;
            break;
        case 83: // "v"
            downMoving = false;
            break;
        case 32:
            spaceMoving = false;
            break;
        case 49:
            oneMoving = false;
            break;
    }
}

var fms = 180;
window.onkeydown = function(event){
    switch(event.keyCode){
        case 79:
            if (animate) {
                animate = false;
                return;
            }
            generateAnimation(fms);
            break;
        case 65: // "<-"
            if (event.shiftKey == 1) modelLeftMoving = true;
            else    leftMoving = true;
            break;
        case 87: // "^"
            if (event.shiftKey == 1) modelUpMoving = true;
            else upMoving = true;
            break;
        case 68: // "->"
            if (event.shiftKey == 1) modelRightMoving = true;
            else rightMoving = true;
            break;
        case 83: // "v"
            if (event.shiftKey == 1) modelDownMoving = true;    
            else downMoving = true;
            break;
        case 32:
            if (event.shiftKey == 1) modelSpaceMoving = true;
            else spaceMoving = true;
            break;
        case 49:
            if (event.shiftKey == 1) modelOneMoving = true;    
            else oneMoving = true;
            break;
        case 82:
            iTranslate.push(iTranslate[0]);
            iRotate.push(iRotate[0]);
            iScale.push(iScale[0]);
            nInstances++;
            break;
        case 84:
            if (nInstances == 1) break;
            iTranslate.pop();
            iRotate.pop();
            iScale.pop();
            nInstances--;
            break;
        case 38:
            if (event.shiftKey == 1) {
                iRotate[0] = mult(quaternion(1, vec3(0.0, 0.0, 1.0)), iRotate[0]);
            }
            break;
        case 40:
            if (event.shiftKey == 1) {
                iRotate[0] = mult(quaternion(-1, vec3(0.0, 0.0, 1.0)), iRotate[0]);
            }
            break;
        case 37:
            if (event.shiftKey == 1) {
                iRotate[0] = mult(quaternion(1, vec3(1.0, 0.0, 0.0)), iRotate[0]);
            }
            break;
        case 39:
            if (event.shiftKey == 1) {
                iRotate[0] = mult(quaternion(-1, vec3(1.0, 0.0, 0.0)), iRotate[0]);
            }
            break;
        case 66:
            if (event.shiftKey == 1) {
                iRotate[0] = quaternion(0.0, vec3(0.0, 1.0, 0.0));
                //iTranslate[0] = vec3(0.0, 0.0, 0.0);
                iScale[0] = vec3(1.0, 1.0, 1.0);
            }
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
    if (event.shiftKey == 0) {
        if(pitch > 89.0)
            pitch = 89.0;
        if(pitch < -89.0)
            pitch = -89.0;

        var f = vec3(
            Math.cos(radians(yaw)) * Math.cos(radians(pitch)),
            Math.sin(radians(pitch)),
            Math.sin(radians(yaw)) * Math.cos(radians(pitch)));
        cameraFront = normalize(f);
    }else {
        iRotate[0] = mult(quaternion(-xoffset, vec3(0.0, 1.0, 0.0)), iRotate[0]);
        //iRotate[0] = mult(quaternion(-yoffset, vec3(0.0, 0.0, 1.0)), iRotate[0]);
    }
    
}

window.onwheel = function(event) {
    if (event.shiftKey == 1){
        var scal = 1.0 / (1.0 + event.deltaY * 0.001);
        iScale[0] = mult(vec3(scal, scal, scal), iScale[0]);
    } else 
    if (animate) {
        if (event.deltaY > 0) {
            if (fms < 1000) fms += 10;
            generateAnimation(fms);
        } else {
            if (fms > 10) fms -= 10;
            generateAnimation(fms);
        }
    }
}