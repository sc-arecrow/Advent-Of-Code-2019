const fs = require('fs');

let asteroid_map;

try {
	const data = fs.readFileSync('data.txt', 'utf8');
    asteroid_map = data.split("\r\n").map(x => x.split(""));
} catch(e) {
	console.log('Error: ' + e.stack);
}

const HEIGHT = asteroid_map.length;
const WIDTH = asteroid_map[0].length;
const asteroid_coords = [];

for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
        if (asteroid_map[i][j] == "#") {
            asteroid_coords.push([j, i]);
        }
    }
}

function countDetectableAsteroids(map, coords) {
    const HEIGHT = map.length;
    const WIDTH = map[0].length;

    const x = coords[0];
    const y = coords[1];

    const checked_map = [];
    let count = 0;

    for (let i = 0; i < HEIGHT; i++) {
        checked_map[i] = [];
        for (let j = 0; j < WIDTH; j++) {
            checked_map[i][j] = false;
        }
    }

    // bottom right corner
    for (let i = y + 1; i < HEIGHT; i++) {
        for (let j = x; j < WIDTH; j++) {
            if (!checked_map[i][j]) {
                const x_shift = j - x;
                const y_shift = i - y;
                let i_temp = i;
                let j_temp = j;
                let blocked = false;

                while (i_temp < HEIGHT && j_temp < WIDTH) {
                    if (!blocked) {
                        if (map[i_temp][j_temp] == "#") {
                            count += 1;
                            blocked = true;
                        }
                    }

                    checked_map[i_temp][j_temp] = true;

                    i_temp += y_shift;
                    j_temp += x_shift;
                }
            }
        }
    }

    // top right corner
    for (let i = y; i >= 0; i--) {
        for (let j = x + 1; j < WIDTH; j++) {
            if (!checked_map[i][j]) {
                const x_shift = j - x;
                const y_shift = i - y;
                let i_temp = i;
                let j_temp = j;
                let blocked = false;

                while (i_temp >= 0 && j_temp < WIDTH) {
                    if (!blocked) {
                        if (map[i_temp][j_temp] == "#") {
                            count += 1;
                            blocked = true;
                        }
                    }

                    checked_map[i_temp][j_temp] = true;

                    i_temp += y_shift;
                    j_temp += x_shift;
                }
            }
        }
    }

    // top left corner
    for (let i = y - 1; i >= 0; i--) {
        for (let j = x; j >= 0; j--) {
            if (!checked_map[i][j]) {
                const x_shift = j - x;
                const y_shift = i - y;
                let i_temp = i;
                let j_temp = j;
                let blocked = false;

                while (i_temp >= 0 && j_temp >= 0) {
                    if (!blocked) {
                        if (map[i_temp][j_temp] == "#") {
                            count += 1;
                            blocked = true;
                        }
                    }

                    checked_map[i_temp][j_temp] = true;

                    i_temp += y_shift;
                    j_temp += x_shift;
                }
            }
        }
    }

    // bottom left corner
    for (let i = y; i < HEIGHT; i++) {
        for (let j = x - 1; j >= 0; j--) {
            if (!checked_map[i][j]) {
                const x_shift = j - x;
                const y_shift = i - y;
                let i_temp = i;
                let j_temp = j;
                let blocked = false;

                while (i_temp < HEIGHT && j_temp >= 0) {
                    if (!blocked) {
                        if (map[i_temp][j_temp] == "#") {
                            count += 1;
                            blocked = true;
                        }
                    }

                    checked_map[i_temp][j_temp] = true;

                    i_temp += y_shift;
                    j_temp += x_shift;
                }
            }
        }
    }

    return count;
}

const best_location = asteroid_coords
    .map(x => [x, countDetectableAsteroids(asteroid_map, x)])
    .reduce(
        (x, y) => x[1] < y[1] ? y : x);

console.log(best_location[1].toString() + " asteroids are detected at coordinates " + best_location[0].toString());

const PI = Math.PI;

function getAngleAboutCentre(coords, centre) {
    const x = coords[0] - centre[0];
    const y = centre[1] - coords[1];

    const angle = (y == 0)
        ? (x > 0)
            ? PI / 2
            : -PI / 2
        : Math.atan(x / y);

    return (y >= 0 && x >= 0) ? angle
        : (y >= 0 && x < 0) ? 2 * PI + angle
        : PI + angle;
}

function getDistanceFromCentre(coords, centre) {
    const x = coords[0] - centre[0];
    const y = centre[1] - coords[1];

    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

asteroid_coords.splice(asteroid_coords.indexOf(best_location[0]), 1)

const asteroid_angles_and_distances = asteroid_coords.map(x =>
    [x, 
    getAngleAboutCentre(x, best_location[0]), 
    getDistanceFromCentre(x, best_location[0])]);

asteroid_angles_and_distances
    .sort((x, y) => 
        (x[1] - y[1] == 0)
            ? x[2] - y[2]
            : x[1] - y[1]);

function findNthVapourised(n) {
    let asteroids_vaped = 0;
    let laser_turned = true;
    let id = 0;
    let prev_vaped;

    while (asteroids_vaped < n) {     
        let next_asteroid = asteroid_angles_and_distances[id];

        if (next_asteroid == "vapourised") {
            id++;
            continue;
        } else if (laser_turned) {
            asteroids_vaped++;
            laser_turned = false;
            prev_vaped = next_asteroid;
        } else if (prev_vaped[1] != next_asteroid[1]) {
            laser_turned = true;
            continue;
        }

        if (id == asteroid_angles_and_distances.length - 1) {
            id = 0;
        } else {
            id++;
        }
    }

    return prev_vaped;
}

console.log("The 200th asteroid to be vapourised has the coordinates " + findNthVapourised(200)[0]);