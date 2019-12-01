const fs = require('fs');

let module_masses_arr;

try {
    const data = fs.readFileSync('data.txt', 'utf8');
    module_masses_arr = data.split("\r\n");
} catch(e) {
    console.log('Error: ', e.stack);
}

const fuel_required_arr = module_masses_arr.map(
    x => Math.floor(parseInt(x) / 3) - 2);

const total_fuel_required = fuel_required_arr.reduce(
    (x, y) => x + y,
    0
);

console.log("The total fuel required (in Part 1) is: " + total_fuel_required.toString());

function getFuelRequired(mass) {
    function helper(mass, total) {
        const fuel_required = Math.floor(mass / 3) - 2;

        if (fuel_required <= 0) {
            return total;
        } else {
            return helper(fuel_required, total + fuel_required);
        }
    }

    return helper(mass, 0);
}

const fuel_required2_arr = module_masses_arr.map(
    x => getFuelRequired(parseInt(x))
);

const total_fuel_required2 = fuel_required2_arr.reduce(
    (x, y) => x + y,
    0
);

console.log("The total fuel required (in Part 2) is: " + total_fuel_required2.toString());