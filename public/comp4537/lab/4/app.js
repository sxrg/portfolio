const gridArea = document.getElementById("grid");
let answerTiles = [];

const TILE_COLOR = '#c8a2c8';
const BLANK_COLOR = 'whitesmoke';
const WAIT_TIME = 800;
let ROTATION = 0;
let MADE_ERROR = false;
const END_MESSAGE = "END GAME AND GO TO LEADER BOARD?";

jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};

function coverTiles() {
    $('ul>li').css('background-color', BLANK_COLOR);
}

function rotateGrid() {
    ROTATION += 90;
    $('#grid').rotate(ROTATION);
}

/**
 * randomly select a tile:
 * if its not already colored, color it
 * repeat until tiles === 0
 * 
 * @param {Number} tiles number of tiles to color
 * @param {Number} gridSize total number of grids (num of <li>)
 * 
 * @returns {picked} a list of indexes with picked tiles
 */
function chooseTiles(tiles, gridSize) {

    const picked = [];

    while (tiles !== 0) {

        let randomNum = Math.floor(Math.random() * gridSize);

        $('#grid').children().eq(randomNum)
            .css('background-color', TILE_COLOR);

        console.log("number: " + randomNum);

        // only confirm the pick if its not a duplicate
        if (picked.includes(randomNum)) {
            console.log("duplicate");
        } else {
            console.log("unique");
            picked.push(randomNum);
            --tiles;
        }
    }

    answerTiles = picked;
    console.log("answers: " + answerTiles);
}

/**
 * - Initializes board
 * - choose tiles
 */
function startGame() {

    MADE_ERROR = false;

    $('#instruction').html("Memorize the colored tile and click.");
    $('#feedback').html("Welcome to the game.");

    // re-init all info
    $('#nav_trial--value').html(0);
    $('#nav_score--value').html(0);

    // reset box dim
    $('#box').css('background-color', BLANK_COLOR);
    $('#box').css('background-image', 'none');
    $('#box').height(150);
    $('#box').width(150);

    // clear grid
    gridArea.innerText = "";

    const START_SIZE = 9;
    const START_TILES = 4;

    // (1) append <li> (2) add event listener for each tile
    for (let i = 0; i < START_SIZE; i++) {
        const tile = document.createElement('LI');
        let index = i;

        // all tile has the possibility of being a chosen
        tile.addEventListener("click", function() {

            // CORRECT
            if (answerTiles.includes(index)) {
                console.log("clicked on answer!");

                // re-color it purple
                $('#grid').children().eq(index)
                    .css('background-color', TILE_COLOR);

                // award point
                $('#nav_score--value').html(function (index, score) {
                    const scoreVal = parseInt(score) + 1;
                    return scoreVal;
                });

                // take it off the answer list
                const key = answerTiles.indexOf(index);
                answerTiles.splice(key, 1);

                if (answerTiles.length === 0) {
                    console.log("all tiles found!");
                    document.getElementById('sound').play();
                    incDifficulty();
                }

            // WRONG
            } else {
                console.log("blank");

                MADE_ERROR = true;
                const currentScore = parseInt($('#nav_score--value').html());
                
                if (currentScore < 1) {
                    // restart
                    $('#feedback').html("Game Over. Try Again!");
                    setTimeout(function() {
                        window.location.href = './summary.html';
                    }, 700);
                } else {
                    // deduct point
                    $('#nav_score--value').html(function (index, score) {
                        const scoreVal = parseInt(score) - 1;

                        return scoreVal;
                    });
                }
            }
        })

        gridArea.append(tile);
    }

    // set certain tiles as 'correct' tiles
    chooseTiles(START_TILES, START_SIZE);

    setTimeout(function() {
        setTimeout(function() {
            rotateGrid();
        }, WAIT_TIME)

        coverTiles();

    }, WAIT_TIME+100);
}

/**
 * Expand grid w,h by +1
 */
function expandGrid() {

    let currHeight = $('#box').height();

    if (currHeight < 350) {
        $('#box').height(function (index, height) {
            return (height + 50);
        });
    
        $('#box').width(function (index, width) {
            return (width + 50);
        });
    }

    // calculate number of tiles needed
    currHeight = $('#box').height();
    const tileDimension = currHeight/50;
    const numTiles = tileDimension * tileDimension;

    // regenerate tiles
    gridArea.innerText = "";

    // (1) append <li> (2) add event listener for each tile
    for (let i = 0; i < numTiles; i++) {
        const tile = document.createElement('LI');
        let index = i;

        // all tile has the possibility of being a chosen
        tile.addEventListener("click", function() {
            if (answerTiles.includes(index)) {
                console.log("clicked on answer!");

                // re-color it purple
                $('#grid').children().eq(index)
                    .css('background-color', TILE_COLOR);

                // award point
                $('#nav_score--value').html(function (index, score) {
                    const scoreVal = parseInt(score) + 1;
                    return scoreVal;
                });

                // take it off the answer list
                const key = answerTiles.indexOf(index);
                answerTiles.splice(key, 1);

                if (answerTiles.length === 0) {
                    console.log("all tiles found!");
                    document.getElementById('sound').play();
                    incDifficulty();
                }

            } else {
                console.log("blank");

                MADE_ERROR = true;
                const currentScore = parseInt($('#nav_score--value').html());
                
                if (currentScore < 1) {
                    // restart
                    $('#feedback').html("Game Over. Try Again!");
                    setTimeout(function() {
                        window.location.href = './summary.html';
                    }, 700);
                } else {
                    // deduct point
                    $('#nav_score--value').html(function (index, score) {
                        const scoreVal = parseInt(score) - 1;

                        return scoreVal;
                    });
                }
            }
        })

        gridArea.append(tile);
    }
    

    return [tileDimension, numTiles];
}

/**
 * Increase difficulty after player ...
 * 
 * - Expand the grid
 * - chooses the next set of tiles
 */
function incDifficulty() {

    $('#nav_trial--value').html(function (index, trial) {
        const trialVal = parseInt(trial) + 1;

        return (trialVal);
    });

    [tileDimension, numTiles] = expandGrid();

    let n_tiles = tileDimension + 1;

    if (MADE_ERROR) {
        --n_tiles;

        MADE_ERROR = false;
    }

    // tiles = height + 1;
    chooseTiles(n_tiles, numTiles);

    // its guessing time!
    setTimeout(function() {
        setTimeout(function() {
            rotateGrid();
        }, WAIT_TIME)

        coverTiles();

    }, WAIT_TIME+100);
}

/**
 * End game: save to db and go to leader board
 */
function terminate() {
    const res = confirm(END_MESSAGE);
    const finalScore = parseInt($('#nav_score--value').html());
    sessionStorage.setItem('score', finalScore);

    if (res == true) {
        // go to summary
        window.location.href = './summary.html';
    }
}

const replay = () => {
    window.location.href = './index.html';
}

// database functions
async function writeScore(score, name) {
    const response = await fetch(`/writeScore/?name=${name}&score=${score}`)
    try {
        const result = await response.text();
        console.log("score posted: " + result);
    } catch (err) {
        console.log(err);
    }
}