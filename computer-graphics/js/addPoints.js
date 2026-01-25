/*
 * @Author: SuBonan
 * @Date: 2023-01-16 09:29:16
 * @LastEditTime: 2023-01-16 12:07:32
 * @FilePath: \shadow\addPoints.js
 * @Github: https://github.com/SugarSBN
 * これなに、これなに、これない、これなに、これなに、これなに、ねこ！ヾ(*´∀｀*)ﾉ
 */
// draw OBJ ===========================================

var squ = 30.0;

var roundPoints = function(){
    points.push(vec4(0.0, 0.0, 0.0, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    points.push(vec4(-squ, 0.0, -squ, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    points.push(vec4(-squ, 0.0, squ, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));

    points.push(vec4(0.0, 0.0, 0.0, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    points.push(vec4(-squ, 0.0, squ, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    points.push(vec4(squ, 0.0, squ, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));

    points.push(vec4(0.0, 0.0, 0.0, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    points.push(vec4(squ, 0.0, squ, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    points.push(vec4(squ, 0.0, -squ, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));

    points.push(vec4(0.0, 0.0, 0.0, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    points.push(vec4(squ, 0.0, -squ, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
    points.push(vec4(-squ, 0.0, -squ, 1.0));
    normals.push(vec4(0.0, 1.0, 0.0, 0.0));
}

var lightPoints = function(lightPosition){
    var squ = 0.1;
    var c1 = subtract(lightPosition, vec4(squ, 0.0, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, -squ, squ, 0.0)));
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, -squ, -squ, 0.0)));
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, -squ, -squ, 0.0)));
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, squ, -squ, 0.0)));
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, squ, -squ, 0.0)));
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, squ, squ, 0.0)));
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, squ, squ, 0.0)));
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, -squ, squ, 0.0)));
    normals.push(vec4(squ, 0.0, 0.0, 0.0));
    
   

    c1 = subtract(lightPosition, vec4(0.0, 0.0, squ, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(add(c1, vec4(-squ, squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(add(c1, vec4(-squ, -squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(add(c1, vec4(-squ, -squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(add(c1, vec4(squ, -squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(add(c1, vec4(squ, -squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(add(c1, vec4(squ, squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(add(c1, vec4(squ, squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    points.push(add(c1, vec4(-squ, squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, squ, 0.0));
    
    c1 = subtract(lightPosition, vec4(0.0, -squ, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(add(c1, vec4(-squ, 0.0, -squ, 0.0)));
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(add(c1, vec4(-squ, 0.0, squ, 0.0)));
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, -squ, 0.0, 0.0));    
    points.push(add(c1, vec4(-squ, 0.0, squ, 0.0)));
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(add(c1, vec4(squ, 0.0, squ, 0.0)));
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(add(c1, vec4(squ, 0.0, squ, 0.0)));
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(add(c1, vec4(squ, 0.0, -squ, 0.0)));
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(add(c1, vec4(squ, 0.0, -squ, 0.0)));
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    points.push(add(c1, vec4(-squ, 0.0, -squ, 0.0)));
    normals.push(vec4(0.0, -squ, 0.0, 0.0));
    
    c1 = subtract(lightPosition, vec4(0.0, 0.0, -squ, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(add(c1, vec4(-squ, squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(add(c1, vec4(-squ, -squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(add(c1, vec4(-squ, -squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(add(c1, vec4(squ, -squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(add(c1, vec4(squ, -squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(add(c1, vec4(squ, squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(c1);
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(add(c1, vec4(squ, squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, -squ, 0.0));
    points.push(add(c1, vec4(-squ, squ, 0.0, 0.0)));
    normals.push(vec4(0.0, 0.0, -squ, 0.0));

    c1 = subtract(lightPosition, vec4(-squ, 0.0, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, squ, -squ, 0.0)));
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, squ, squ, 0.0)));
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, squ, squ, 0.0)));
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, -squ, squ, 0.0)));
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, -squ, squ, 0.0)));
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, -squ, -squ, 0.0)));
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(c1);
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, -squ, -squ, 0.0)));
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    points.push(add(c1, vec4(0.0, squ, -squ, 0.0)));
    normals.push(vec4(-squ, 0.0, 0.0, 0.0));
    
}