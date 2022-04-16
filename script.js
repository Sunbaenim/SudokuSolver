const delay = async () => new Promise(resolve => setTimeout(resolve, document.getElementById('fill-time').value));
var slowFillButtonChecked;
const sudoku = document.createElement('table');
const length = 9;

const createDOMGrid = function() {
    const sudokuContainer = document.getElementById('sudoku-container');
    sudoku.setAttribute('id', 'sudoku');
    sudokuContainer.appendChild(sudoku);
    var tbody = document.createElement('tbody');
    for (let k = 0; k < length / 3; k++) {
        var colgroup = document.createElement('colgroup');
        sudoku.appendChild(colgroup);
        for (let l = 0; l < length / 3; l++) {
            let col = document.createElement('col');
            colgroup.appendChild(col);
        }
    }
    for (let i = 0; i < length; i++) {
        if (i % 3 === 0) {
            tbody = document.createElement('tbody');
            sudoku.appendChild(tbody);
        }
        let tr = document.createElement('tr');
        tbody.appendChild(tr);
        for (let j = 0; j < length; j++) {
            let td = document.createElement('td');
            tr.appendChild(td);
            let span = document.createElement('span');
            td.appendChild(span);
        }
    }
}

const createDOMGridInputs = function() {
    const tds = document.querySelectorAll('#sudoku td');
    tds.forEach(td => {
        let input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('oninput', 'if (this.value.length > 1) this.value = this.value.slice(0, 1); if (this.value === "0") this.value = ""');
        td.appendChild(input);
    });
}

var prefillNumbers = [];

const getStartingGrid = function() {
    const gridValues = document.querySelectorAll('#sudoku td input');
    let indexGridValues = 0;
    for (let i = 0; i < gridValues.length / length; i++) {
        for (let j = 0; j < gridValues.length / length; j++, indexGridValues++) {
            gridValues[indexGridValues].value !== '' ? prefillNumbers.push({row: i, col: j, number: parseInt(gridValues[indexGridValues].value)}) : '';
            gridValues[indexGridValues].disabled = true;
        }
        
    }
}

const convertPositionsInto3DGrid = function({row = 0, col = 0, number = 0}) {
    pos = (Math.floor(row / 3) * 9 * 3) + (Math.floor(col / 3) * 9) + (row % 3 * 3) + col % 3;
    square = (pos - (pos % 9)) / 9;
    row = row % 3;
    col = col % 3;
    return {square, row, col, number};
}

const createGrid = function(prefillNumbers) {
    let newGrid = new Array(length);
    for (let k = 0; k < newGrid.length; k++) {
        newGrid[k] = new Array(length / 3);
        for (let i = 0; i < newGrid.length / 3; i++) {
            newGrid[k][i] = new Array(length / 3);
        }
    }

    prefillNumbers.forEach(prefillNumber => {
        let newPos = convertPositionsInto3DGrid(prefillNumber);
        newGrid[newPos.square][newPos.row][newPos.col] = prefillNumber.number;
    });

    return newGrid;
}

const create2DGrid = function(prefillNumbers) {
    let newGrid = new Array(length);
    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i] = new Array(length);
    }
    for (let j = 0; j < prefillNumbers.length; j++) {
        newGrid[prefillNumbers[j].row][prefillNumbers[j].col] = prefillNumbers[j].number;
    }
    return newGrid;
}

var numberToTest2D = {row: 0, col: 0, number: 1};
var numberToTest3D = convertPositionsInto3DGrid(numberToTest2D);

const updateGrid = function(fill = numberToTest3D.number, color = 'rgba(200, 0, 0, 0.5)') {
    sudoku.children[Math.floor(numberToTest3D.square / 3) + 3].children[Math.floor(numberToTest3D.row % 3)].children[(numberToTest3D.square % 3 * 3) + numberToTest3D.col].firstChild.innerText = fill;
    if (slowFillButtonChecked) {
        sudoku.children[Math.floor(numberToTest2D.row / 3) + 3].children[numberToTest2D.row % 3].children[numberToTest2D.col].style.backgroundColor = color;
    }
}

var grid;

const fillNumber = function() {
    grid[numberToTest3D.square][numberToTest3D.row][numberToTest3D.col] = numberToTest3D.number;
    if (slowFillButtonChecked) {
        sudoku.children[Math.floor(numberToTest2D.row / 3) + 3].children[numberToTest2D.row % 3].children[numberToTest2D.col].style.backgroundColor = 'rgba(0, 150, 0, 0.5)';
    }
}

var startingGrid;

const HasPrefillNumber = function() {
    if (numberToTest2D.row !== -1 && numberToTest2D.row !== 9) {
        if (startingGrid[numberToTest2D.row][numberToTest2D.col] === undefined) {
            return false;
        }
        return true;
    }
}

const isNumberInRow = function(numberToTest = numberToTest3D, verifyGrid) {
    let square = 0 + Math.floor(numberToTest.square / 3) * 3;
    for (let i = 0; i < length / 3; i++) {
        if (square === numberToTest.square) {
            square += 1;
        } else if (grid[square][numberToTest.row].includes(numberToTest.number)) {
            return true;
        } else {
            square += 1;
        }
    }
    return false;
}

const isNumberInCol = function(numberToTest = numberToTest3D, verifyGrid) {
    let square = 0 + numberToTest.square % 3;
    let i = 0;
    while (i < length / 3) {
        if ((square === numberToTest.square && square < 6)) {
            square += 3;
        }
        else if (grid[square][i][numberToTest.col] === numberToTest.number && !verifyGrid) {
            return true;
        } else if (i % 3 === 2 && square < 6) {
            square += 3;
            i = 0;
        } else {
            i++;
        }
    }
    return false;
}

const isNumberInSquare = function(numberToTest = numberToTest3D, verifyGrid) {
    for (let i = 0; i < length / 3; i++) {
        for (let j = 0; j < length / 3; j++) {
            if (verifyGrid && i === numberToTest.row && j === numberToTest.col) {
                j++;
            } else if (grid[numberToTest.square][i][j] === numberToTest.number) {
                return true;
            }
        }
    }
    return false;
}

const doesNumberHaveConstraints = function(numberToTest = numberToTest3D, verifyGrid = false) {
    if (isNumberInSquare(numberToTest, verifyGrid) || isNumberInRow(numberToTest, verifyGrid) || isNumberInCol(numberToTest, verifyGrid)) {
        return true;
    }
    return false;
}

const isGridValid = function() {
    let newPrefillNumbers = [];
    prefillNumbers.forEach(prefillNumber => {
        newPrefillNumbers.push(convertPositionsInto3DGrid(prefillNumber));
    });
    for (let i = 0; i < newPrefillNumbers.length; i++) {
        if (doesNumberHaveConstraints(newPrefillNumbers[i], true)) {
            return false;
        }
    }
    return true;
}

const previousBlankSpace = function() {
    if (!HasPrefillNumber()) {
        grid[numberToTest3D.square][numberToTest3D.row][numberToTest3D.col] = undefined;
        slowFillButtonChecked ? updateGrid('', 'transparent') : updateGrid('');
    }
    if (numberToTest3D.row === 0 && numberToTest3D.col === 0) {
        if (numberToTest3D.square % 3 === 0) {
            numberToTest2D.row -= 1;
            numberToTest2D.col = length - 1;
        } else {
            numberToTest2D.row += 2;
            numberToTest2D.col -= 1;
        }
        numberToTest3D.square -= 1;
        numberToTest3D.row = 2;
        numberToTest3D.col = 2;
    } else if (numberToTest3D.col === 0) {
        if (numberToTest3D.row !== 0) {
            numberToTest3D.row -= 1;
            numberToTest3D.col = grid[numberToTest3D.row].length - 1;
            numberToTest3D.number = grid[numberToTest3D.square][numberToTest3D.row][numberToTest3D.col];
            numberToTest2D.row -= 1;
            numberToTest2D.col += 2;
        }
    } else {
        numberToTest3D.col -= 1;
        numberToTest3D.number = grid[numberToTest3D.square][numberToTest3D.row][numberToTest3D.col];
        numberToTest2D.col -= 1;
    }
    if (HasPrefillNumber()) {
        previousBlankSpace();
    }
}

const nextBlankSpace = function() {
    if (numberToTest3D.row === 2 && numberToTest3D.col === 2) {
        numberToTest3D.square += 1;
        numberToTest3D.col = 0;
        numberToTest3D.row = 0;
        if (numberToTest3D.square % 3 === 0) {
            numberToTest2D.row += 1;
            numberToTest2D.col = 0;
        } else {
            numberToTest2D.row -= 2;
            numberToTest2D.col += 1;
        }
    } else if (numberToTest3D.col === 2) {
        numberToTest3D.row += 1;
        numberToTest3D.col = 0;
        numberToTest2D.row += 1;
        numberToTest2D.col -= 2;
    } else {
        numberToTest3D.col += 1;
        numberToTest2D.col += 1;
    }
    if (HasPrefillNumber()) {
        nextBlankSpace();
    }
    numberToTest3D.number = 1;
}

const fillingTest = function() {
    updateGrid();
    if (doesNumberHaveConstraints()) {
        return false;
    }
    fillNumber();
    return true;
}

var lastBlankSpaceToFill;

const initGrid = function() {
    getStartingGrid();
    grid = createGrid(prefillNumbers);
    startingGrid = create2DGrid(prefillNumbers);
    lastBlankSpaceToFill = {square: grid.length - 1, row: grid[grid.length - 1].length - 1, col: grid[grid.length - 1][grid[grid.length - 1].length - 1].length - 1};
}

const enableInputs = function() {
    const gridValues = document.querySelectorAll('#sudoku td');
    gridValues.forEach(value => {
        value.children[1].disabled = false;
    });
}

const sudokuSolver = async function() {
    initGrid();
    let count = 0;
    if (isGridValid()) {
        while (numberToTest3D.square !== lastBlankSpaceToFill.square + 1) {
            count++;
            slowFillButtonChecked = document.getElementById('slow-mode').checked;
            if (slowFillButtonChecked) {
                await delay();
            }
            if (!HasPrefillNumber()) {
                if (numberToTest3D.number > length) {
                    previousBlankSpace();
                    numberToTest3D.number++;
                } else {
                    if (fillingTest()) {
                        nextBlankSpace();
                    } else {
                        numberToTest3D.number++;
                    }
                }
            } else {
                nextBlankSpace();
            }
        }
    } else {
        alert("The grid provided is not valid!");
        enableInputs();
        prefillNumbers = [];
    }
    console.log(count, "itérations.");
}

const resetGrid = function() {
    const gridValues = document.querySelectorAll('#sudoku td');
    gridValues.forEach(value => {
        value.firstChild.innerText = '';
        if (slowFillButtonChecked) {
            value.style.backgroundColor = 'transparent';
        }
        value.children[1].value = '';
        value.children[1].disabled = false;
    });
    numberToTest2D = {row: 0, col: 0, number: 1};
    numberToTest3D = {square: 0, row: 0, col: 0, number: 1};
    prefillNumbers = [];
}

window.onload = createDOMGrid(), createDOMGridInputs();