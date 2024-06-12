<template>
<div class="row">
    <div class="col-md-6">
        <h3 class="text-center align-center"><b> Puzzle Maker</b></h3>
        <div class="text-center">
            <img src="/src/assets/Sudoku-rafiki.png" style="width: 400px; height: 400px;">
        </div>
        <div class="text-center" v-if="inputbox">
            <div class="input-container">
                <label for="wordsInput"> Enter Words Tamil/English(Separated by Space):</label><br><br>
                <input type="text" id="wordsInput" v-model="words" placeholder="சொற்கள் / Words" />
            </div>
            <q-btn outline style="color:blue;" label=" Generate Puzzle" @click="generatePuzzle" />
        </div>
    </div>

    <div class="col-md-6">
        <div v-if="puzzleGrid.length > 0" class="puzzle-container q-mt-xl q-pt-xl">
            <table class="puzzle-grid" style="border: none;">
                <tbody>
                    <tr v-for="(row, rowIndex) in puzzleGrid" :key="rowIndex">
                        <td v-for="(cell, colIndex) in row" :key="colIndex" :class="{ 'filled': !isEmptyCell(cell) }">
                            <template v-if="cell !== '' && !Array.isArray(cell) && show">
                                {{ cell }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table><br>

            <button style="color: blue;" @click="showAnswer"> Show Answer</button>&nbsp;&nbsp;
            <button style="color: blue;" @click="hideAnswer"> Hide Answer</button>
        </div>
    </div>
</div>
</template>

<script>
import GraphemeSplitter from 'grapheme-splitter';

export default {
    data() {
        return {
            words: '',
            puzzleGrid: [],
            showPuzzle: false,
            inputbox: true,
            show: false,
        };
    },
    methods: {
        isEmptyCell(cell) {
            return cell === '';
        },
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        generatePuzzle() {
            let wordList = this.words.toUpperCase().split(' ');
            wordList = this.shuffleArray(wordList); // Shuffle the word list
            const maxLength = Math.max(...wordList.map(word => word.length)) + 5;

            // Initialize the puzzle grid
            this.puzzleGrid = Array.from({
                length: maxLength
            }, () => Array(maxLength).fill(''));

            // Generate puzzle for each word
            for (const word of wordList) {
                let placed = false;

                // Try to place the word intersecting with existing words
                for (let row = 0; row < maxLength && !placed; row++) {
                    for (let col = 0; col < maxLength && !placed; col++) {
                        const directions = [{
                                dRow: 0,
                                dCol: 1
                            }, // Right
                            {
                                dRow: 1,
                                dCol: 0
                            } // Down
                        ];

                        for (const {
                                dRow,
                                dCol
                            } of directions) {
                            if (this.canPlaceWord(word, row, col, dRow, dCol, true)) {
                                this.placeWord(word, row, col, dRow, dCol);
                                placed = true;
                                break;
                            }
                        }
                    }
                }

                // If not placed through intersection, place it normally
                if (!placed) {
                    for (let row = 0; row < maxLength && !placed; row++) {
                        for (let col = 0; col < maxLength && !placed; col++) {
                            if (this.isEmptyCell(this.puzzleGrid[row][col])) {
                                const directions = [{
                                        dRow: 0,
                                        dCol: 1
                                    }, // Right
                                    {
                                        dRow: 1,
                                        dCol: 0
                                    } // Down
                                ];

                                for (const {
                                        dRow,
                                        dCol
                                    } of directions) {
                                    if (this.canPlaceWord(word, row, col, dRow, dCol, false)) {
                                        this.placeWord(word, row, col, dRow, dCol);
                                        placed = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Show the puzzle grid
            this.showPuzzle = true;
            this.inputbox = true;
        },

        canPlaceWord(word, row, col, dRow, dCol, intersect) {
            const maxLength = this.puzzleGrid.length;
            const splitter = new GraphemeSplitter();
            const wordArray = splitter.splitGraphemes(word); // Split word into graphemes
            const wordLength = wordArray.length;

            // Calculate the end position of the word
            const endRow = row + (wordLength - 1) * dRow;
            const endCol = col + (wordLength - 1) * dCol;

            // Check if the end position is within the grid boundaries
            if (endRow < 0 || endRow >= maxLength || endCol < 0 || endCol >= maxLength) {
                return false;
            }

            let intersecting = false;

            // Check if each position along the word's path is empty or contains the same letter
            for (let i = 0; i < wordLength; i++) {
                const currentRow = row + i * dRow;
                const currentCol = col + i * dCol;

                // Check if the current position is within the grid boundaries
                if (currentRow < 0 || currentRow >= maxLength || currentCol < 0 || currentCol >= maxLength) {
                    return false;
                }

                const currentCell = this.puzzleGrid[currentRow][currentCol];
                const wordChar = wordArray[i];

                // If the current cell is not empty and does not contain the same letter as the word, return false
                if (currentCell !== '' && currentCell !== wordChar) {
                    return false;
                }

                // Check if the word intersects with existing words
                if (currentCell === wordChar) {
                    intersecting = true;
                }
            }

            // If intersection is required but none was found, return false
            if (intersect && !intersecting) {
                return false;
            }

            return true;
        },

        placeWord(word, row, col, dRow, dCol) {
            const splitter = new GraphemeSplitter();
            const wordArray = splitter.splitGraphemes(word); // Split word into graphemes
            const wordLength = wordArray.length;

            // Place the word starting from the given position and direction
            for (let i = 0; i < wordLength; i++) {
                const newRow = row + i * dRow;
                const newCol = col + i * dCol;

                // If the cell is already filled, ensure that the existing letter matches the current word letter
                if (this.puzzleGrid[newRow][newCol] !== '' && this.puzzleGrid[newRow][newCol] !== wordArray[i]) {
                    throw new Error('Word placement conflict!');
                }
                this.puzzleGrid[newRow][newCol] = wordArray[i];
            }
        },

        showAnswer() {
            this.show = true;
        },
        hideAnswer() {
            this.show = false;
        }
    }
};
</script>

<style scoped>
.input-container {
    margin-bottom: 20px;
}

.input-container label {
    font-weight: bold;
}

.button-container {
    margin-top: 20px;
}

.puzzle-container {
    margin-top: 20px;
    text-align: center;
}

.puzzle-grid {
    border: none;
    /* Remove border from the table */
    text-align: center;
    display: flex;
    justify-content: center;
}

.puzzle-grid td {
    width: 25px;
    height: 25px;
    border: none;
    /* Remove border from the table cells */
    text-align: center;
    font-weight: bold;
}

.filled {
    background-color: rgb(183, 183, 253);
}

</style>
