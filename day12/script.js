const fs = require('fs');

let data;

try {
	data = fs.readFileSync('data.txt', 'utf8');
} catch(e) {
	console.log('Error: ' + e.stack);
}

function getPosition() {
    return data
        .split("\r\n")
        .map(x => x.split(","))
        .map(x => x.map(y => parseInt(y.slice(y.indexOf("=") + 1))));
}

const position_arr_part1 = getPosition();

const velocity_arr_part1 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

const combinations = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3]
];

function applyGravity(position_arr, velocity_arr) {
    for (let i = 0; i < 3; i++) { //x, y and z
        for (let j = 0; j < combinations.length; j++) {// each pair of moons
            const moonA = combinations[j][0];
            const moonB = combinations[j][1];

            const moonA_position = position_arr[moonA][i];
            const moonB_position = position_arr[moonB][i];

            if (moonA_position > moonB_position) {
                velocity_arr[moonA][i]--; //moonA_velocity
                velocity_arr[moonB][i]++; //moonB_velocity
            } else if (moonA_position < moonB_position) {
                velocity_arr[moonA][i]++; //moonA_velocity
                velocity_arr[moonB][i]--; //moonB_velocity
            }
        }
    }
}

function applyVelocity(position_arr, velocity_arr) {
    for (let i = 0; i < position_arr.length; i++) {
        for (let j = 0; j < position_arr[0].length; j++) {
            position_arr[i][j] += velocity_arr[i][j];
        }
    }
}

function calculateTotalEnergy(position_arr, velocity_arr) {
    let total_energy = 0;
    
    for (let i = 0; i < position_arr.length; i++) {
        const potential_energy = position_arr[i].reduce(
            (x, y) => x + Math.abs(y),
            0
        );

        const kinetic_energy = velocity_arr[i].reduce(
            (x, y) => x + Math.abs(y),
            0
        );

        total_energy += potential_energy * kinetic_energy;
    }

    return total_energy;
}

const NUM_OF_STEPS = 1000;

for (let i = 0; i < NUM_OF_STEPS; i++) {
    applyGravity(position_arr_part1, velocity_arr_part1);
    applyVelocity(position_arr_part1, velocity_arr_part1);
}

console.log("The total energy after " 
    + NUM_OF_STEPS.toString() 
    + " steps is " 
    + calculateTotalEnergy(position_arr_part1, velocity_arr_part1).toString());

const position_arr_part2 = getPosition();

const velocity_arr_part2 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

function transpose(M) {
    const MT = [];
    const rows = M.length;
    const cols = M[0].length;

    for (let c = 0; c < cols; c++) {
        MT[c] = [];

        for (let r = 0; r < rows; r++) {
            MT[c][r] = M[r][c];
        }
    }

    return MT;
}

const initial_positions = transpose(position_arr_part2);
const initial_velocities = [0, 0, 0, 0];

let step_count = 0;
const found = [false, false, false];
let all_found = found.reduce((x, y) => x && y);
const periods = [];


while (!all_found) {
    applyGravity(position_arr_part2, velocity_arr_part2);
    applyVelocity(position_arr_part2, velocity_arr_part2);
    step_count++;

    const current_positions = transpose(position_arr_part2);
    const current_velocities = transpose(velocity_arr_part2);

    for (let i = 0; i <= 2; i++) {
        if (!found[i]) {
            if (current_positions[i].toString() == initial_positions[i].toString()
                &&
                current_velocities[i].toString() == initial_velocities.toString()) {
                
                found[i] = true;
                periods[i] = step_count;
            }
        }
    }

    all_found = found.reduce((x, y) => x && y);
}

function lcm(a, b) {
    let smaller = a < b ? a : b;
    let bigger = smaller == a ? b : a;

    for (let i = 1; i <= smaller; i++) {
        const multiple = bigger * i;

        if (multiple % smaller == 0) {
            return multiple;
        }
    }
}

console.log("The number of steps required to return to the initial state is " + periods.reduce(lcm).toString());