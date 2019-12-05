const PUZZLE_INPUT = [197487, 673251];

function checkPart1(num) {
    const digits = num.toString().split("").map(x => parseInt(x));

    const isAscending = digits.reduce(
        (x, y) => [x[0] && (x[1] <= y), y],
        [true, 0]
    )[0];

    const hasDouble = digits.reduce(
        (x, y) => [x[0] || (x[1] == y), y],
        [false, 0]
    )[0];

    return isAscending && hasDouble;
}

let count_part1 = 0;

for (let i = PUZZLE_INPUT[0]; i <= PUZZLE_INPUT[1]; i++) {
    if (checkPart1(i)) {
        count_part1++;
    }
}

console.log("Total number of passwords that meet the criteria of Part 1: " + count_part1.toString());

function checkPart2(num) {
    const digits = num.toString().split("").map(x => parseInt(x));

    const isAscending = digits.reduce(
        (x, y) => [x[0] && (x[1] <= y), y],
        [true, 0]
    )[0];

    let count = 1;
    let count_arr = [];
    for (let i = 1; i < digits.length; i++) {
        if (digits[i] == digits[i - 1]) {
            count++;
        } else {
            count_arr.push(count);
            count = 1;
        }
    }
    count_arr.push(count);
    
    const hasStrictDouble = count_arr.includes(2);

    return isAscending && hasStrictDouble;
}

let count_part2 = 0;

for (let i = PUZZLE_INPUT[0]; i <= PUZZLE_INPUT[1]; i++) {
    if (checkPart2(i)) {
        count_part2++;
    }
}

console.log("Total number of passwords that meet the criteria of Part 2: " + count_part2.toString());