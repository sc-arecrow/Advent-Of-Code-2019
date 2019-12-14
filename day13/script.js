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

function processIntcodePart1(intcode, id, relative_base) {
    let x_output;
    let x_output_found = false;
    let y_output;
    let y_output_found = false;

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
            
            if (!x_output_found) {
                x_output = output;
                id += 2;
                x_output_found = true;
            } else if (!y_output_found) {
                y_output = output;
                id += 2;
                y_output_found = true;
            } else {
                id += 2;
                return [x_output, y_output, output, id, relative_base];
            }
        } else if (opcode == "03") {            
            const modeW = instruction.charAt(2);

            const input = 0;
            
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

function getDrawInstructions() {
    const draw_instructions = [];
    const arcade_cabinet_software = prepareIntcode();

    let done = false;
    let id = 0;
    let relative_base = 0;

    while (!done) {
        const output = processIntcodePart1(
            arcade_cabinet_software,
            id,
            relative_base
        );

        if (output == "done") {
            done = true;
        } else {
            const x_output = output[0];
            const y_output = output[1];
            const tile_id = output[2];

            draw_instructions.push([x_output, y_output, tile_id]);

            id = output[3];
            relative_base = output[4];
        }        
    }

    return draw_instructions;
}

function getScreen(draw_instructions) {
    const screen = [];

    const tile_id_to_sprite = {
        0 : " ",
        1 : "#",
        2 : "=",
        3 : "_",
        4 : "O"
    }

    const max_x = draw_instructions.reduce(
        (sofar, next) => next[0] > sofar ? next[0] : sofar,
        0
    );

    const max_y = draw_instructions.reduce(
        (sofar, next) => next[1] > sofar ? next[1] : sofar,
        0
    );

    for (let r = 0; r <= max_y; r++) {
        screen[r] = [];

        for (let c = 0; c <= max_x; c++) {
            screen[r][c] = " "
        }
    }

    function drawPixel(pixel_instructions) {
        const x = pixel_instructions[0];
        const y = pixel_instructions[1];
        const tile_sprite = tile_id_to_sprite[pixel_instructions[2]];

        screen[y][x] = tile_sprite;
    }

    for (let i = 0; i < draw_instructions.length; i++) {
        drawPixel(draw_instructions[i]);
    }

    return screen;
}

function drawScreen(screen) {
    console.log(screen.map(x => x.join("")));
}

const draw_instructions = getDrawInstructions();
const screen = getScreen(draw_instructions);

const num_of_blocks = screen.reduce(
    (x, y) => x + y.reduce(
        (x, y) => x + (y == "=" ? 1 : 0),
        0
    ),
    0
);

console.log("The number of blocks is " + num_of_blocks.toString());

function processIntcodePart2(intcode, input, id, relative_base) {
    let x_output;
    let x_output_found = false;
    let y_output;
    let y_output_found = false;

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
            
            if (!x_output_found) {
                x_output = output;
                id += 2;
                x_output_found = true;
            } else if (!y_output_found) {
                y_output = output;
                id += 2;
                y_output_found = true;
            } else {
                id += 2;
                return [x_output, y_output, output, id, relative_base];
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

function scoreAfterGame(quarters) {
    const arcade_cabinet_software = prepareIntcode();
    arcade_cabinet_software[0] = quarters;

    let done = false;
    let id = 0;
    let relative_base = 0;

    let score;
    let input;
    let paddle_x = 0;
    let ball_x = 0;


    while (!done) {
        if (paddle_x < ball_x) {
            input = 1;
        } else if (paddle_x > ball_x) {
            input = -1;
        } else {
            input = 0;
        }

        const output = processIntcodePart2(
            arcade_cabinet_software,
            input,
            id,
            relative_base
        );

        if (output == "done") {
            done = true;
        } else {
            const x_output = output[0];
            const y_output = output[1];
            const tile_id = output[2];

            if (tile_id == 3) {
                paddle_x = x_output;
            } else if (tile_id == 4) {
                ball_x = x_output;
            } else if (x_output == -1 && y_output == 0) {
                score = tile_id;
            }

            id = output[3];
            relative_base = output[4];
        }        
    }

    return score;
}

console.log("The score at the end of the game is " + scoreAfterGame(2).toString());