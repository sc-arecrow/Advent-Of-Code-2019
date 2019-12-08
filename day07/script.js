const fs = require('fs');

let intcode_arr;

try {
	const data = fs.readFileSync('data.txt', 'utf8');
	intcode_arr = data.split(",");
	intcode_arr = intcode_arr.map(x => parseInt(x));
} catch(e) {
	console.log('Error: ' + e.stack);
}

function permutations(xs) {
    let ret = [];
  
    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = permutations(xs.slice(0, i).concat(xs.slice(i + 1)));
    
        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }

    return ret;
}

const phase_settings_part1 = permutations([0, 1, 2, 3, 4]);
const phase_settings_part2 = permutations([5, 6, 7, 8, 9]);

function prepareIntcode() {
	return intcode_arr.map(x => x);
}

function prepareInstruction(inst) {
    return (inst.length == 4)
        ? inst
        : prepareInstruction("0" + inst);
}

function processIntcodePart1(intcode, phase_setting, input_signal) {
    let id = 0;
    let phase_setting_done = false;
    let output;

	while (intcode[id] !== 99) {
        const instruction = prepareInstruction(intcode[id].toString());
        
        const opcode = instruction.slice(-2);
        
        if (opcode == "01" || opcode == "02") {
            const mode1 = instruction.charAt(1);
            const mode2 = instruction.charAt(0);

            const param1 = (mode1 == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];

            const param2 = (mode2 == "0")
                ? intcode[intcode[id + 2]]
                : intcode[id + 2];

            const result = (opcode == "01")
                ? param1 + param2
                : param1 * param2;
            
            intcode[intcode[id + 3]] = result;

            id += 4;
        } else if (opcode == "04") {
            const mode = instruction.charAt(1);

            output = (mode == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];

            id += 2;
        } else if (opcode == "03") {            
            const input = !phase_setting_done
                ? phase_setting
                : input_signal;
            
            phase_setting_done = true;
            
            intcode[intcode[id + 1]] = input;

            id += 2;
        } else if (opcode == "05" || opcode == "06") {
            const mode1 = instruction.charAt(1);
            const mode2 = instruction.charAt(0);

            const param1 = (mode1 == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];

            const param2 = (mode2 == "0")
                ? intcode[intcode[id + 2]]
                : intcode[id + 2];
            
            if ((param1 != 0 && opcode == "05")
                ||
                (param1 == 0 && opcode == "06")) {
                id = param2;
            } else {
                id += 3;
            }
        } else if (opcode == "07" || opcode == "08") {
            const mode1 = instruction.charAt(1);
            const mode2 = instruction.charAt(0);

            const param1 = (mode1 == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];

            const param2 = (mode2 == "0")
                ? intcode[intcode[id + 2]]
                : intcode[id + 2];

            if ((param1 < param2 && opcode == "07")
                ||
                (param1 == param2 && opcode == "08")) {
                intcode[intcode[id + 3]] = 1;
            } else {
                intcode[intcode[id + 3]] = 0;
            }

            id += 4;
        }
    }

    return output;
}

function calculateOutputPart1(phase_setting) {
    let input_signal = 0;

    for (let i = 0; i < phase_setting.length; i++) {
        input_signal = processIntcodePart1(
            prepareIntcode(),
            phase_setting[i],
            input_signal);
    }

    return input_signal;
}

const output_signals_part1 = phase_settings_part1.map(calculateOutputPart1);
const largest_output_part1 = output_signals_part1.reduce(
    (x, y) => x < y ? y : x, 
    0
);

console.log("The largest output for Part 1 is " + largest_output_part1.toString());

function calculateOutputPart2(phase_setting) {
    let input_signal = 0;
    let intcodes = [];
    let phase_setting_done = [false, false, false, false, false];
    let ids = [0, 0, 0, 0, 0];

    for (let i = 0; i < phase_setting.length; i++) {
        intcodes.push(prepareIntcode());
    }

    let all_halted = false;

    while (!all_halted) {
        for (let i = 0; i < phase_setting.length; i++) {
            if (ids[i] !== "done") {
                const temp = processIntcodePart2(
                    intcodes[i],
                    phase_setting[i],
                    input_signal,
                    phase_setting_done[i],
                    ids[i]
                );

                ids[i] = temp[0];
                input_signal = temp[1];
            }
        }

        phase_setting_done = [true, true, true, true, true];

        all_halted = ids.reduce(
            (x, y) => x && y == "done",
            true
        );
    }

    return input_signal;
}

function processIntcodePart2(
        intcode, phase_setting, input_signal, 
        phase_setting_done, id) {
    let output;

	while (intcode[id] !== 99) {
        const instruction = prepareInstruction(intcode[id].toString());
        
        const opcode = instruction.slice(-2);
        
        if (opcode == "01" || opcode == "02") {
            const mode1 = instruction.charAt(1);
            const mode2 = instruction.charAt(0);

            const param1 = (mode1 == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];

            const param2 = (mode2 == "0")
                ? intcode[intcode[id + 2]]
                : intcode[id + 2];

            const result = (opcode == "01")
                ? param1 + param2
                : param1 * param2;
            
            intcode[intcode[id + 3]] = result;

            id += 4;
        } else if (opcode == "04") {
            const mode = instruction.charAt(1);

            output = (mode == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];

            id += 2;

            return [id, output];
        } else if (opcode == "03") {            
            const input = !phase_setting_done
                ? phase_setting
                : input_signal;
            
            phase_setting_done = true;
            
            intcode[intcode[id + 1]] = input;

            id += 2;
        } else if (opcode == "05" || opcode == "06") {
            const mode1 = instruction.charAt(1);
            const mode2 = instruction.charAt(0);

            const param1 = (mode1 == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];

            const param2 = (mode2 == "0")
                ? intcode[intcode[id + 2]]
                : intcode[id + 2];
            
            if ((param1 != 0 && opcode == "05")
                ||
                (param1 == 0 && opcode == "06")) {
                id = param2;
            } else {
                id += 3;
            }
        } else if (opcode == "07" || opcode == "08") {
            const mode1 = instruction.charAt(1);
            const mode2 = instruction.charAt(0);

            const param1 = (mode1 == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];

            const param2 = (mode2 == "0")
                ? intcode[intcode[id + 2]]
                : intcode[id + 2];

            if ((param1 < param2 && opcode == "07")
                ||
                (param1 == param2 && opcode == "08")) {
                intcode[intcode[id + 3]] = 1;
            } else {
                intcode[intcode[id + 3]] = 0;
            }

            id += 4;
        }
    }

    if (intcode[id] == 99) {
        return ["done", input_signal];
    }
}

const output_signals_part2 = phase_settings_part2.map(calculateOutputPart2);
const largest_output_part2 = output_signals_part2.reduce(
    (x, y) => x < y ? y : x, 
    0
);

console.log("The largest output for Part 2 is " + largest_output_part2.toString());