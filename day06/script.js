const fs = require('fs');

let orbit_arr;

try {
	const data = fs.readFileSync('data.txt', 'utf8');
    orbit_arr = data.split("\r\n");
    orbit_arr.pop();
} catch(e) {
	console.log('Error: ' + e.stack);
}

const orbit_dict = {};

function initialiseDict() {
    for (let i = 0; i < orbit_arr.length; i++) {
        const centre = orbit_arr[i].slice(0, 3);
        const satellite = orbit_arr[i].slice(4);

        orbit_dict[satellite] = centre;
    }
}

initialiseDict();

function processOrbitMap() {
    function getNumOrbits(satellite) {
        function helper(satellite, acc) {
            return (satellite == "COM")
                ? acc
                : helper(orbit_dict[satellite], acc + 1);
        }
    
        return helper(satellite, 0);
    }

    let orbit_count = 0;

    for (let i = 0; i < orbit_arr.length; i++) {
        const satellite = orbit_arr[i].slice(4);

        orbit_count += getNumOrbits(satellite);
    }

    return orbit_count;
}

const total_orbit_count = processOrbitMap();

console.log("The total number of direct and indirect orbits is " + total_orbit_count.toString());

function getPathToCOM(satellite) {
    function helper(satellite, acc) {
        if (satellite == "COM") {
            acc.push("COM");
            return acc;
        } else {
            acc.push(satellite);
            return helper(orbit_dict[satellite], acc);
        }
    }

    return helper(satellite, []);
}

function minTransfersRequired(sat1, sat2) {
    const path1 = getPathToCOM(sat1);
    const path2 = getPathToCOM(sat2);

    while (path1[path1.length - 1] == path2[path2.length - 1]) {
        path1.pop();
        path2.pop();
    }

    return path1.length + path2.length;
}

const you_to_santa = minTransfersRequired(orbit_dict["YOU"], orbit_dict["SAN"]);

console.log("The minimum number of orbital transfers required is " + you_to_santa.toString());