const fs = require('fs');

let wires_arr;

try {
	const data = fs.readFileSync('data.txt', 'utf8');
	wires_arr = data.split("\r\n");
} catch(e) {
	console.log('Error: ' + e.stack);
}

const first_wire = wires_arr[0].split(",");
const second_wire = wires_arr[1].split(",");

const first_path = [[0, 0]];
const second_path = [[0, 0]];

function add_to_path(move, path) {
    const move_direction = move.charAt(0);
    const move_length = parseInt(move.slice(1));

    const path_id = path.length;
    let x = path[path_id - 1][0];
    let y = path[path_id - 1][1];

    for (let i = 0; i < move_length; i++) {
        switch(move_direction) {
            case "R":
                x++;
                break;
            case "L":
                x--;
                break;
            case "U":
                y++;
                break;
            case "D":
                y--;
                break;
            default:
                console.log("Unidentified direction");
        }

        path.push([x, y]);
    }
}

function includes(path, point) {
    let found = [false, null];

    for (let i = 0; i < path.length; i++) {
        if (path[i][0] == point[0]
            &&
            path[i][1] == point[1]) {
                found = [true, i];
                break;
            }
    }

    return found;
}

function find_intersections(p1, p2) {
    const intersections = [];

    for (let i = 0; i < p1.length; i++) {
        const found = includes(p2, p1[i]);
        if (found[0]) {
            intersections.push([p1[i], found[1] + i]);
        }
    }

    return intersections;
}

const get_man_dist = pt => Math.abs(pt[0]) + Math.abs(pt[1]);

function evaluate_path(wire, path) {
    for (let i = 0; i < wire.length; i++) {
        add_to_path(wire[i], path);
    }
}

evaluate_path(first_wire, first_path);

evaluate_path(second_wire, second_path);

const intersections = find_intersections(first_path, second_path);

intersections.shift();

const closest_intersection = intersections.reduce(
    (x, y) => x[1] > get_man_dist(y[0]) 
        ? [y[0], get_man_dist(y[0])]
        : x,
    [[0, 0], Infinity]
);

const shortest_intersection = intersections.reduce(
    (x, y) => x[1] > y[1]
        ? y : x,
    [[0, 0], Infinity]
);

console.log("The closest intersection is " 
    + closest_intersection[0].toString() 
    + " with a Manhattan distance of " 
    + closest_intersection[1].toString());

console.log("The shortest intersection is " 
    + shortest_intersection[0].toString() 
    + " with " 
    + shortest_intersection[1].toString()
    + " number of combined steps required.");
