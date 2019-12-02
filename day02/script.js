const fs = require('fs');

let intcode_arr;

try {
	const data = fs.readFileSync('data.txt', 'utf8');
	intcode_arr = data.split(",");
	intcode_arr = intcode_arr.map(x => parseInt(x));
} catch(e) {
	console.log('Error: ' + e.stack);
}

function prepareIntcode(noun, verb) {
	let temp = intcode_arr.map(x => x);
	temp[1] = noun;
	temp[2] = verb;
	return temp;
}

function processIntcode(intcode) {
	id = 0;

	while (intcode[id] !== 99) {
		const opcode = intcode[id];
		const first_pos = intcode[id + 1];
		const second_pos = intcode[id + 2];
		const first_num = intcode[first_pos];
		const second_num = intcode[second_pos];
		
		const result = opcode === 1
			? first_num + second_num
			: first_num * second_num;
	
		const res_pos = intcode[id + 3];
	
		intcode[res_pos] = result;
	
		id += 4;
	}
}

const intcode_part1 = prepareIntcode(12, 2);
processIntcode(intcode_part1);

console.log("The value at position 0 of the intcode is: " + intcode_part1[0].toString());

const WANTED_OUTPUT = 19690720;

function findInputs() {
	for (let noun = 0; noun <= 99; noun++) {
		for (let verb = 0; verb <= 99; verb++) {
			const intcode_try = prepareIntcode(noun, verb);
	
			processIntcode(intcode_try);
	
			const output = intcode_try[0];
	
			if (output === WANTED_OUTPUT) {
				console.log("The noun and verb that produces the output "
				+ WANTED_OUTPUT.toString() + " are " 
				+ noun.toString() + " and " 
				+ verb.toString() + " respectively.");
				return undefined;
			} else {
				continue;
			}
		}
	}
}

findInputs();