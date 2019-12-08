const fs = require('fs');

let image_str;

try {
	const data = fs.readFileSync('data.txt', 'utf8');
    image_str = data;
} catch(e) {
	console.log('Error: ' + e.stack);
}

const layer_str_arr = [];
const WIDTH = 25;
const HEIGHT = 6;
const IMAGE_SIZE = WIDTH * HEIGHT;

for (let i = 0; i < image_str.length; i += IMAGE_SIZE) {
    layer_str_arr.push(image_str.substr(i, IMAGE_SIZE));
}

layer_str_arr.pop();

function processLayer(layer_str) {
    let zeros = 0;
    let ones = 0;
    let twos = 0;

    for (let i = 0; i < layer_str.length; i++) {
        switch(layer_str.charAt(i)) {
            case "0":
                zeros++;
                break;
            case "1":
                ones++;
                break;
            case "2":
                twos++;
                break;
            default:
        }
    }

    return [zeros, ones, twos];
}

const counts = layer_str_arr.map(processLayer);  

const fewest_zeros = counts.reduce(
    (x, y) => x[0] > y[0] ? y : x,
    [Infinity, 0, 0]
);

console.log("Product of ones and twos is " + (fewest_zeros[1] * fewest_zeros[2]).toString());

function makeLayer(layer_str) {
    let id = 0;
    const layer = [];

    for (let r = 0; r < HEIGHT; r++) {
        layer[r] = [];

        for (let c = 0; c < WIDTH; c++) {
            layer[r].push(layer_str.charAt(id))

            id++;
        }
    }

    return layer;
}

function makeFinalImage() {
    const layers = layer_str_arr.map(makeLayer);
    const final_image = [];

    for (let r = 0; r < HEIGHT; r++) {
        final_image[r] = [""];

        for (let c = 0; c < WIDTH; c++) {
            const final_pixel = layers.reduce(
                (x, y) => (x == "0" || x == "1") ? x : y[r][c],
                "2"
            );

            final_image[r] += (final_pixel == "0") ? "." : "X";
        }
    }

    return final_image;
}

const final_image = makeFinalImage();
console.log(final_image);
console.log("The password is GJYEA");
