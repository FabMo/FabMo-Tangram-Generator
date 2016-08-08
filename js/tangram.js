/*jslint todo: true, browser: true, continue: true, white: true*/
/*global api*/

//All values are considered in inches
var DEFAULT_BIT_WIDTH = 0.5;
var DEFAULT_BIT_LENGTH = 0.5;
var DEFAULT_FEEDRATE = 120;
var DEFAULT_SIZE = 1;
var DEFAULT_THICKNESS = 1;

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

function applyOptions() {
    checkNumber("size");
    checkNumber("board-thickness");
}

function applyCutProperties() {
    checkNumber("bit-width");
    checkNumber("bit-length");
    checkNumber("feedrate");
}

// Fill the input with the default values
document.getElementById("size").value = DEFAULT_SIZE;
document.getElementById("board-thickness").value = DEFAULT_THICKNESS;
document.getElementById("bit-width").value = DEFAULT_BIT_WIDTH;
document.getElementById("bit-length").value = DEFAULT_BIT_LENGTH;
document.getElementById("feedrate").value = DEFAULT_FEEDRATE;

document.getElementById("size-apply").onclick = applyOptions;
document.getElementById("cut-apply").onclick = applyCutProperties;
