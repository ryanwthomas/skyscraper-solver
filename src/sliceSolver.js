function winnowSlice(slice, value) {

    let branchSolution = startBranch(slice, value);

    // if start branch fails, puzzle is broken. return empty array
    if (!branchSolution) {
        // console.log('Failed on the first branch.')
        return Array(slice.length).fill(new Array(0));
    }

    // first branch establishes starting list of possiblities
    let allPossibilities = branchSolution.map(x => [x]);

    // iterate over each cell
    for (let i = 0; i < slice.length; i++) {
        // without this variable we get the following warning:
        // Function declared in a loop contains unsafe references to variable(s) 'allPossibilities
        const foundPossibilities = allPossibilities[i];
        // remove possibliities that have already been found
        const unusedPossibilities = slice[i].filter(x => {
            // console.log(`apple => ${allPossibilities[i].includes(x)}`)
            return !foundPossibilities.includes(x);
        });

        let sliceCopy = slice.slice();

        for (let j = 0; j < unusedPossibilities.length; j++) {
            let x = unusedPossibilities[j];
            // set new slice with a given value at given position
            sliceCopy[i] = [x];

            let solution;
            // if branch succeeds, add possibilties
            if ((solution = startBranch(sliceCopy, value))) {
                // add possbilities
                for (let j = 0; j < allPossibilities.length; j++) {
                    allPossibilities[j].push(solution[j])
                }
            }
        }
    }

    // sort values and remove duplicates
    allPossibilities = allPossibilities.map(cell => {
        cell.sort();
        return cell.filter( (element, index, array) => ( array.indexOf(element) === index ) );
    })

    // TODO: remove duplicates and sort
    // console.log(`winnow result ${allPossibilities}`);
    return allPossibilities;
}

function startBranch(slice, targetValue) {
    return branch(slice, targetValue, 0, 0, Array(0));
}

// find solution for slice
function branch(slice, targetValue, index, value, solution) {
    // console.log(`${slice}\t${index}\t${targetValue}\t${value}\t${solution}`);

    // TODO: add more conditionals to end branch early
    if (slice.length === index) {
        // console.log(`end of branch: solution is ${solution}; value is ${value}; goal is ${targetValue}; condition is ${targetValue === value}.`);s
        return (targetValue === value) ? solution : null;
    }

    const prevMax = Math.max(...solution);
    for (let i = 0; i < slice[index].length; i++) {
        const x = slice[index][i];
        // only iterate on values that haven't previously appeared
        if (!solution.includes(x)) {
            // console.log(`${x} > ${prevMax} (${solution}) = ${x > prevMax}`)

            let newSolution = branch(slice, targetValue, index + 1,
                value + ((x > prevMax) ? 1 : 0), solution.concat([x]));

            // if solution found, return it
            if (newSolution) {
                return newSolution;
            }
        }
    }

    // console.log(`no solution found ${solution}`)
    // if solution found in subbranches, return null
    return null;

}

export default winnowSlice;