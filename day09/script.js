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

function processIntcode(intcode, input) {
    let id = 0;
    let relative_base = 0;

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
            
            console.log("Output: " + output.toString());
            
            id += 2;
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

    console.log("Opcode 99: The program has halted.");
}

console.log("Part 1 BOOST Test Mode")
processIntcode(prepareIntcode(), 1);

console.log("Part 2 Sensor Boost Mode")
processIntcode(prepareIntcode(), 2);