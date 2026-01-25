/*
 * @Author: SuBonan
 * @Date: 2023-01-18 16:46:34
 * @LastEditTime: 2023-01-18 17:31:08
 * @FilePath: \shadow\animation.js
 * @Github: https://github.com/SugarSBN
 * これなに、これなに、これない、これなに、これなに、これなに、ねこ！ヾ(*´∀｀*)ﾉ
 */
var generateAnimation = function (frames) {
    animateFrame = 0;
    animateS = [];
    animateT = [];
    animateR = [];
    nFrames = frames;
    animate = false;
    if (nInstances < 5) return;
    var dSx = (iScale[4][0] - iScale[1][0]) / frames;
    var dSy = (iScale[4][1] - iScale[1][1]) / frames;
    var dSz = (iScale[4][2] - iScale[1][2]) / frames;
    for (var i = 0;i < frames;i++){
        animateS.push(vec3(iScale[1][0] + dSx * i, iScale[1][1] + dSy * i, iScale[1][2] + dSz * i));
        animateT.push(bezier(iTranslate[1], iTranslate[2], iTranslate[3], iTranslate[4], i / frames));
        console.log(slerp(iRotate[1], iRotate[4], i / frames));
        animateR.push(slerp(iRotate[1], iRotate[4], i / frames));
    }
    animate = true;
}