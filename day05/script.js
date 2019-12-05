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
    return (inst.length == 4)
        ? inst
        : prepareInstruction("0" + inst);
}

function processIntcodePart1(intcode) {
	id = 0;

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

            const output = (mode == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];
            
            console.log("Output: " + output.toString());
            
            id += 2;
        } else if (opcode == "03") {            
            const input = 1;
            
            intcode[intcode[id + 1]] = input;

            console.log("Input: " + input.toString());
            id += 2;
        }
    }
    
    console.log("Opcode 99: The program has halted.");
}

console.log("Part 1 Diagnostic Test");
processIntcodePart1(prepareIntcode());

function processIntcodePart2(intcode) {
	id = 0;

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

            const output = (mode == "0")
                ? intcode[intcode[id + 1]]
                : intcode[id + 1];
            
            console.log("Output: " + output.toString());
            
            id += 2;
        } else if (opcode == "03") {            
            const input = 5;
            
            intcode[intcode[id + 1]] = input;

            console.log("Input: " + input.toString());
            
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
    
    console.log("Opcode 99: The program has halted.");
}

console.log("Part 2 Diagnostic Test");
processIntcodePart2(prepareIntcode());