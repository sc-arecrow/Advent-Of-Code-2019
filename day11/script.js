const fs = require('fs');

let intcode_arr;

try {
	const data = fs.readFileSync('data.txt', 'utf8');
    intcode_arr = data.split(",");
    intcode_arr = intcode_arr.map(x => parseInt(x));
} catch(e) {
	console.log('Error: ' + e.stack);
}

function prepareIntcode() {
	return intcode_arr.map(x => x);
}

function prepareInstruction(inst) {
    return (inst.length == 5)
        ? inst
        : prepareInstruction("0" + inst);
}

function runRobot(starting_panel_colour) {
    const painted_coords = {};

    let id = 0;
    let relative_base = 0;

    let x = 0;
    let y = 0;
    let direction = 0;
    let is_starting = true;
    let done = false;

    const make_coords = (x, y) => x.toString() + "," + y.toString();

    function moveRobot(direction) {
        switch(direction) {
            case 0: //UP
                y++;
                break;
            case 2: //DOWN
                y--;
                break;
            case 3: //LEFT
                x--;
                break;
            case 1: //RIGHT
                x++;
                break;
            default:
        }
    }

    const painting_program = prepareIntcode();

    while (!done) {
        const input = (is_starting)
            ? starting_panel_colour
            : (painted_coords[make_coords(x, y)] == undefined)
                ? 0
                : painted_coords[make_coords(x, y)];

        is_starting = false;

        const output = processIntcode(
            painting_program, 
            input,
            id,
            relative_base);

        if (output == "done") {
            done = true;
        } else {
            const colour = output[0];
            const turn = (output[1] == 0) ? -1 : 1;
            
            id = output[2];
            relative_base = output[3];

            painted_coords[make_coords(x, y)] = colour;
            direction += turn;
            direction = (direction == 4) ? 0
                : (direction == -1) ? 3
                : direction;
            
            moveRobot(direction);
        }
    }

    return painted_coords;
}

function processIntcode(intcode, input, id, relative_base) {
    let first_output;
    let first_output_found = false;

	while (intcode[id] !== 99) {
        const instruction = prepareInstruction(intcode[id].toString());

        const opcode = instruction.slice(-2);
        
        if (opcode == "01" || opcode == "02") {
            const mode1 = instruction.charAt(2);
            const mode2 = instruction.charAt(1);
            const modeW = instruction.charAt(0);

            const param1 = (mode1 == "2")
                ? (intcode[intcode[id + 1] + relative_base] == undefined ? 0 : intcode[intcode[id + 1] + relative_base])
                : (mode1 == "0")
                    ? (intcode[intcode[id + 1]] == undefined ? 0 : intcode[intcode[id + 1]])
                    : intcode[id + 1];

            const param2 = (mode2 == "2")
                ? (intcode[intcode[id + 2] + relative_base] == undefined ? 0 : intcode[intcode[id + 2] + relative_base])
                : (mode2 == "0")
                    ? (intcode[intcode[id + 2]] == undefined ? 0 : intcode[intcode[id + 2]])
                    : intcode[id + 2];

            const result = (opcode == "01")
                ? param1 + param2
                : param1 * param2;
            
            intcode[intcode[id + 3] + (modeW == "2" ? relative_base : 0)] = result;

            id += 4;
        } else if (opcode == "04") {
            const mode = instruction.charAt(2);

            const output = (mode == "2")
                ? (intcode[intcode[id + 1] + relative_base] == undefined ? 0 : intcode[intcode[id + 1] + relative_base])
                : (mode == "0")
                    ? (intcode[intcode[id + 1]] == undefined ? 0 : intcode[intcode[id + 1]])
                    : intcode[id + 1];
            
            if (!first_output_found) {
                first_output = output;
                id += 2;
                first_output_found = true;
            } else {
                id += 2;
                return [first_output, output, id, relative_base];
            }
        } else if (opcode == "03") {            
            const modeW = instruction.charAt(2);
            
            intcode[intcode[id + 1] + (modeW == "2" ? relative_base : 0)] = input;

            id += 2;
        } else if (opcode == "05" || opcode == "06") {
            const mode1 = instruction.charAt(2);
            const mode2 = instruction.charAt(1);

            const param1 = (mode1 == "2")
                ? (intcode[intcode[id + 1] + relative_base] == undefined ? 0 : intcode[intcode[id + 1] + relative_base])
                : (mode1 == "0")
                    ? (intcode[intcode[id + 1]] == undefined ? 0 : intcode[intcode[id + 1]])
                    : intcode[id + 1];

            const param2 = (mode2 == "2")
                ? (intcode[intcode[id + 2] + relative_base] == undefined ? 0 : intcode[intcode[id + 2] + relative_base])
                : (mode2 == "0")
                    ? (intcode[intcode[id + 2]] == undefined ? 0 : intcode[intcode[id + 2]])
                    : intcode[id + 2];
            
            if ((param1 != 0 && opcode == "05")
                ||
                (param1 == 0 && opcode == "06")) {
                id = param2;
            } else {
                id += 3;
            }
        } else if (opcode == "07" || opcode == "08") {
            const mode1 = instruction.charAt(2);
            const mode2 = instruction.charAt(1);
            const modeW = instruction.charAt(0);

            const param1 = (mode1 == "2")
                ? (intcode[intcode[id + 1] + relative_base] == undefined ? 0 : intcode[intcode[id + 1] + relative_base])
                : (mode1 == "0")
                    ? (intcode[intcode[id + 1]] == undefined ? 0 : intcode[intcode[id + 1]])
                    : intcode[id + 1];

            const param2 = (mode2 == "2")
                ? (intcode[intcode[id + 2] + relative_base] == undefined ? 0 : intcode[intcode[id + 2] + relative_base])
                : (mode2 == "0")
                    ? (intcode[intcode[id + 2]] == undefined ? 0 : intcode[intcode[id + 2]])
                    : intcode[id + 2];

            if ((param1 < param2 && opcode == "07")
                ||
                (param1 == param2 && opcode == "08")) {
                intcode[intcode[id + 3] + (modeW == "2" ? relative_base : 0)] = 1;
            } else {
                intcode[intcode[id + 3] + (modeW == "2" ? relative_base : 0)] = 0;
            }

            id += 4;
        } else if (opcode == "09") {
            const mode = instruction.charAt(2);

            const param = (mode == "2")
            ? (intcode[intcode[id + 1] + relative_base] == undefined ? 0 : intcode[intcode[id + 1] + relative_base])
            : (mode == "0")
                ? (intcode[intcode[id + 1]] == undefined ? 0 : intcode[intcode[id + 1]])
                : intcode[id + 1];

            relative_base += param;

            id += 2;
        }
    }

    if (intcode[id] == 99) {
        return "done";
    }
}

const painted_coords_part1 = runRobot(0);

const panels_painted = Object.keys(painted_coords_part1).length;

console.log("The number of panels painted in Part 1 is " + panels_painted);

const painted_coords_part2 = runRobot(1);

painted_coords_arr = [];

function toInt(s) {
    if (s.charAt(0) == "-") {
        return -1 * parseInt(s.slice(1));
    } else {
        return parseInt(s);
    }
}

for (let key in painted_coords_part2) {
    let value = painted_coords_part2[key];

    const coords = key.split(",").map(toInt);
    painted_coords_arr.push([coords, value]);
}

const max_and_min_x = painted_coords_arr.reduce(
    (sofar, next) => (next[0][0] > sofar[0])
        ? [next[0][0], sofar[1]]
        : (next[0][0] < sofar[1])
            ? [sofar[0], next[0][0]]
            : sofar,
    [-Infinity, Infinity]
);

const max_and_min_y = painted_coords_arr.reduce(
    (sofar, next) => (next[0][1] > sofar[0])
        ? [next[0][1], sofar[1]]
        : (next[0][1] < sofar[1])
            ? [sofar[0], next[0][1]]
            : sofar,
    [-Infinity, Infinity]
);

const HEIGHT = max_and_min_y[0] - max_and_min_y[1] + 1;
const WIDTH = max_and_min_x[0] - max_and_min_x[1] + 1;

let painting = [];

for (let i = 0; i < HEIGHT; i++) {
    painting[i] = [];
    for (let j = 0; j < WIDTH; j++) {
        painting[i][j] = ".";
    }
}

for (let i = 0; i < painted_coords_arr.length; i++) {
    const coord = painted_coords_arr[i];
    x_coord = coord[0][0] - max_and_min_x[1];
    y_coord = HEIGHT - 1 - (coord[0][1] - max_and_min_y[1]);

    painting[y_coord][x_coord] = (coord[1] == 0) ? "." : "X";
}

painting = painting.map(
    (x => x.join(""))
);

console.log(painting);
console.log("The registration identifier is JZPJRAGJ")