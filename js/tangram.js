/*jslint todo: true, browser: true, continue: true, white: true*/
/*global api*/

//All values are considered in inches
var DEFAULT_BIT_WIDTH = 0.5;
var DEFAULT_BIT_LENGTH = 0.5;
var DEFAULT_FEEDRATE = 120;
var DEFAULT_SAFEZ = 3;
var DEFAULT_SIZE = 1;
var DEFAULT_THICKNESS = 1;

var TAB_HEIGHT_RATIO = 0.25;
var TAB_WIDTH_RATIO_SMALLEST_SIZE = 1/3;

var size = DEFAULT_SIZE;
var boardThickness = DEFAULT_THICKNESS;
var cutProperties = new api.gcode.CutProperties(
    DEFAULT_BIT_WIDTH, DEFAULT_BIT_LENGTH, 0, DEFAULT_FEEDRATE
);
var safeZ = DEFAULT_SAFEZ;

/**
 * Checks the number value of an input text element, corrects it and returns the
 * corrected value.
 *
 * @param {object} id - The id of the input element.
 * @return {number} The corrected value of the element.
 */
function checkNumber(id) {
    var element = document.getElementById(id);
    if(element === null) {
        return 0;
    }

    var value = parseFloat(element.value);
    if(isNaN(value)) {
        element.value = 0;
        return 0;
    }
    element.value = value;
    return value;
}

function getTabProperties(size, boardThickness) {
    var smallestSize = Math.sqrt(size * size + size * size) / 4;
    return new api.gcode.TabProperties(
        smallestSize * TAB_WIDTH_RATIO_SMALLEST_SIZE,
        boardThickness * TAB_HEIGHT_RATIO
    );
}

function applyOptions() {
    size = checkNumber("size");
    boardThickness = checkNumber("board-thickness");
}

function applyCutProperties() {
    cutProperties.bitWidth = checkNumber("bit-width");
    cutProperties.bitLength = checkNumber("bit-length");
    cutProperties.feedrate = checkNumber("feedrate");
    safeZ = checkNumber("safeZ");
}

function generate() {
    var tabProperties = getTabProperties(size, boardThickness);
    var hSize = size / 2;
    var qSize = size / 4;

    var path2DA = [];
    path2DA.push(new api.math.Vector(0, 0));
    path2DA.push(new api.math.Vector(hSize, 0));
    path2DA.push(new api.math.Vector(size, 0));
    path2DA.push(new api.math.Vector(size, hSize));
    path2DA.push(new api.math.Vector(size, size));
    path2DA.push(new api.math.Vector(0, size));
    path2DA.push(new api.math.Vector(0, 0));
    path2DA.push(new api.math.Vector(qSize, qSize));
    path2DA.push(new api.math.Vector(hSize, hSize));
    path2DA.push(new api.math.Vector(0, size));
    var codeA = api.gcode.cutPath2DWithTabs(
        path2DA, boardThickness, cutProperties, tabProperties, safeZ
    );

    var path2DB = [];
    path2DB.push(new api.math.Vector(qSize, qSize));
    path2DB.push(new api.math.Vector(hSize, 0));
    path2DB.push(new api.math.Vector(3 * qSize, qSize));
    path2DB.push(new api.math.Vector(hSize, hSize));
    path2DB.push(new api.math.Vector(3 * qSize, 3 * qSize));
    path2DB.push(new api.math.Vector(3 * qSize, qSize));
    path2DB.push(new api.math.Vector(size, hSize));
    var codeB = api.gcode.cutPath2DWithTabs(
        path2DB, boardThickness, cutProperties, tabProperties, safeZ
    );

    var path2DC = [];
    path2DC.push(new api.math.Vector(3 * qSize, 3 * qSize));
    path2DC.push(new api.math.Vector(size, size));
    var codeC = api.gcode.cutPath2DWithTabs(
        path2DC, boardThickness, cutProperties, tabProperties, safeZ
    );

    var arrayCode = [codeA, codeB, codeC];
    console.log(arrayCode);
    var codeComplete = arrayCode.join("\n");
    console.log(codeComplete);
}

document.getElementById("size").value = DEFAULT_SIZE;
document.getElementById("board-thickness").value = DEFAULT_THICKNESS;
document.getElementById("bit-width").value = DEFAULT_BIT_WIDTH;
document.getElementById("bit-length").value = DEFAULT_BIT_LENGTH;
document.getElementById("feedrate").value = DEFAULT_FEEDRATE;
document.getElementById("safeZ").value = DEFAULT_SAFEZ;

document.getElementById("size-apply").onclick = applyOptions;
document.getElementById("cut-apply").onclick = applyCutProperties;

document.getElementById("generate").onclick = generate;
