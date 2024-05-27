<template>
     <div id="app">
    <h1>Crossword Puzzle</h1>
    <div>
      <table>
        <tbody>
          <tr v-for="(row, rowIndex) in puzzle" :key="rowIndex">
            <td v-for="(cell, colIndex) in row" :key="colIndex" :class="{ 'cell': true, 'filled': cell.filled }">
              <input v-if="!cell.filled" type="text" v-model="cell.value" maxlength="1" @input="checkComplete">
              <span v-else>{{ cell.value }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <button @click="reset">Reset</button>
    </div>
    <div>
      <p v-if="isComplete">Congratulations! You completed the puzzle.</p>
    </div>
  </div>
</template>
<script>
    new Vue({
      el: '#app',
      data() {
        return {
          puzzle: [
            [{ value: 'A', filled: true }, { value: '', filled: false }, { value: '', filled: false }],
            [{ value: '', filled: false }, { value: '', filled: false }, { value: '', filled: false }],
            [{ value: '', filled: false }, { value: '', filled: false }, { value: 'B', filled: true }],
          ],
          isComplete: false
        };
      },
      methods: {
        checkComplete() {
          for (let row of this.puzzle) {
            for (let cell of row) {
              if (!cell.filled && cell.value === '') {
                this.isComplete = false;
                return;
              }
            }
          }
          this.isComplete = true;
        },
        reset() {
          for (let row of this.puzzle) {
            for (let cell of row) {
              if (!cell.filled) {
                cell.value = '';
              }
            }
          }
          this.isComplete = false;
        }
      }
    });
  </script>