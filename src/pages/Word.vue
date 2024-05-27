<template>
    <div id="app" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
    
    <h4>Puzzle Generator</h4>
      <!-- puzzlegenerate Grid -->
      <div  class="puzzlegenerate-grid">
      <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        class="puzzlegenerate-grid-row"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :class="['puzzlegenerate-grid-cell', { 'active': cell.active }]">
          {{ cell.text }}
        </div>
      </div>
    </div>

    <div v-if="generate" class="word-input">
        <input type="text" id="words" v-model="wordInput" @input="validateWordInput"></input><br><br>
        <!-- Buttons for showing/hiding answers -->
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;gap: 10px;">
          <q-btn  outline color="blue-14" @click="updateWordsGrid"  label="Generate Words"/> 
        </div>
      </div>
     <br>
     
      <div  v-if="gridtable">
      <q-btn class="glossy" rounded color="green-9" @click="showAnswers" label="Show Answers"/>&nbsp;&nbsp;
      <q-btn class="glossy" rounded color="red-9" @click="hideAnswers" label="Hide Answers"/>
      </div>

     

     

    </div>
  </template>
  <script>
  export default {
    name: "App",
    data() {
      return {
        gridtable:false,
        generate:true,
        gridSize:20,
        grid: [],
        wordInput: "",
        originalGrid: [],
      };
    },
    // created() {
    //   this.generatepuzzlegenerate();
    // },
    methods: {
      handleGridSizeChange() {
        this.gridSize = Math.max(Math.min(this.gridSize, 20), 5);
      },
      generatepuzzlegenerate() {
        this.grid = [];
        for (let i = 0; i < this.gridSize; i++) {
          const row = [];
          for (let j = 0; j < this.gridSize; j++) {
            row.push({ text: "", word: "", active: false, number: 0 });
          }
          this.grid.push(row);
        }
        this.updateWordsGrid();
        this.originalGrid = JSON.parse(JSON.stringify(this.grid));
      },
      updateGrid(updatedGrid) {
        this.grid = updatedGrid;
      },
      updateWordsGrid() {
        const words = this.wordInput.split(" ").map(word => word.trim().toUpperCase());
        this.grid = this.generatepuzzlegenerateGrid(words, this.gridSize);
        this.originalGrid = JSON.parse(JSON.stringify(this.grid));
        this.hideAnswers();
        this.gridtable = true
        this.generate = false
      },
      generatepuzzlegenerateGrid(words, gridSize) {
        const grid = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => ({ text: "", word: "", active: false, number: 0 })));
        const getRandomPosition = () => ({
          row: Math.floor(Math.random() * gridSize),
          col: Math.floor(Math.random() * gridSize)
        });
        const getRandomDirection = () => (Math.random() < 0.5 ? "across" : "down");
        const canPlaceWord = (word, row, col, direction) => {
          if (
            (direction === "across" && col + word.length > gridSize) ||
            (direction === "down" && row + word.length > gridSize)
          ) {
            return false;
          }
          for (let i = 0; i < word.length; i++) {
            let r = direction === "across" ? row : row + i;
            let c = direction === "across" ? col + i : col;
            if (grid[r][c].text !== "" && grid[r][c].text !== word[i]) {
              return false;
            }
          }
          return true;
        };
        const placeWord = (word, row, col, direction) => {
          for (let i = 0; i < word.length; i++) {
            let r = direction === "across" ? row : row + i;
            let c = direction === "across" ? col + i : col;
            grid[r][c].text = word[i];
            grid[r][c].word = word;
            grid[r][c].active = true;
            if (i === 0) {
              grid[r][c].number = word.length;
            }
          }
        };
        const placeWordWithIntersections = (word) => {
          let placed = false;
          while (!placed) {
            const { row, col } = getRandomPosition();
            const direction = getRandomDirection();
            if (canPlaceWord(word, row, col, direction)) {
              placeWord(word, row, col, direction);
              placed = true;
            } else {
              for (let i = 0; i < word.length; i++) {
                for (let r = 0; r < gridSize; r++) {
                  for (let c = 0; c < gridSize; c++) {
                    if (grid[r][c].text === word[i]) {
                      const newRow = direction === "across" ? r : r - i;
                      const newCol = direction === "across" ? c - i : c;
                      if (canPlaceWord(word, newRow, newCol, direction)) {
                        placeWord(word, newRow, newCol, direction);
                        placed = true;
                        break;
                      }
                    }
                  }
                  if (placed) break;
                }
                if (placed) break;
              }
            }
          }
        };
        words.forEach(placeWordWithIntersections);
        return grid;
      },
      hideAnswers() {
        this.grid = JSON.parse(JSON.stringify(this.originalGrid));
        this.grid.forEach(row => {
          row.forEach(cell => {
            cell.text = "";
          });
        });
      },
      showAnswers() {
        this.grid = JSON.parse(JSON.stringify(this.originalGrid));
      },
    },
  };
  </script>
  <style> 
  /* Define background color for active cells */
  #app .puzzlegenerate-grid-cell.active {
    background-color: #aaf;
  }
  /* Define background color for inactive cells */
  #app .puzzlegenerate-grid-cell:not(.active) {
   
    border: 1px solid white;
   
  }

  .puzzlegenerate-grid {
    display: flex;
    flex-direction: column;
  }
  .puzzlegenerate-grid-row {
    display: flex;
  }
  .puzzlegenerate-grid-cell {
    width: 25px;
    height: 25px;
    border: 1px solid whitesmoke;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .puzzlegenerate-grid-cell.active {
    background-color: white;
  }
  .puzzlegenerate-grid-cell:not(.active) {
    /* background-color: rgb(21, 20, 20); */
  }
  </style>