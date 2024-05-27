<template>
  <div>
    <h4 class="text-center"><b>Puzzle Maker</b></h4>

    <div class="text-center" v-if="inputbox">
      <div class="input-container">
        <label for="wordsInput">Enter Words (Separated by Space):</label>
        <input type="text" id="wordsInput" v-model="words" placeholder="Words" />
      </div>

      <q-btn outline style="color: goldenrod;" label="Generate Puzzle" @click="generatePuzzle" />
    </div>

    <div v-if="showPuzzle" class="puzzle-container">
      <table class="puzzle-grid">
        <tbody>
          <tr v-for="(row, rowIndex) in puzzleGrid" :key="rowIndex">
            <td v-for="(cell, colIndex) in row" :key="colIndex" :class="{ 'filled': !isEmptyCell(cell) }">
              <template v-if="cell !== '' && !(Array.isArray(cell) && cell.every(c => c === '')),show">
                {{ cell }}
              </template>
            </td>
          </tr>
        </tbody>
      </table><br>

      <button @click="showAnswer">Show Answer</button>&nbsp;&nbsp;
      <button @click="hideAnswer">Hide Answer</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      words: '',
      puzzleGrid: [],
      showPuzzle: false,
      inputbox: true,
      show: false
    };
  },
  methods: {
    isEmptyCell(cell) {
      return cell === '';
    },
    generatePuzzle() {
  const wordList = this.words.toUpperCase().split(' ');

  // Find the maximum length of the words
  const maxLength = wordList.reduce((max, word) => Math.max(max, word.length), 0);

  // Initialize the puzzle grid with empty arrays
  this.puzzleGrid = Array.from({ length: maxLength }, () => Array(maxLength).fill([]));

  // Iterate over each word
  wordList.forEach((word, index) => {
    // Iterate over each letter in the word
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      // Check if the letter exists in any other words
      const intersectingWords = wordList.filter((otherWord, otherIndex) =>
        otherIndex !== index && otherWord.includes(letter)
      );
      // If the letter exists in other words, add the current letter to the intersection points
      if (intersectingWords.length > 0) {
        intersectingWords.forEach((intersectingWord) => {
          const intersectingIndex = intersectingWord.indexOf(letter);
          this.puzzleGrid[wordList.indexOf(intersectingWord)][intersectingIndex].push(letter);
        });
        this.puzzleGrid[index][i].push(letter);
      }
    }
  });

  // Convert arrays to strings for display
  this.puzzleGrid.forEach((row) => {
    row.forEach((cell, index) => {
      row[index] = cell.join(', ');
    });
  });

  this.showPuzzle = true;
  this.inputbox = false;
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
  border-collapse: collapse;
  text-align: center;
  display: flex;
  justify-content: center;
}

.puzzle-grid td {
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  text-align: center;
  font-weight: bold;
}

.filled {
  background-color: #aaf;
}
</style>
