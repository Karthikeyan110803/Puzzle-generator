<template>
  <div class="crossword">
    <div class="grid">
      <div :class="['word', word.orientation === 'across' ? 'across' : 'down']" v-for="(word, wordIndex) in words" :key="wordIndex">
        <div class="row" v-for="(char, charIndex) in word.chars" :key="charIndex">
          <div class="cell">
            <input v-model="word.chars[charIndex]" :maxlength="1" @keyup="moveToNextCell($event, wordIndex, charIndex)" :class="{ 'intersect': isIntersection(wordIndex, charIndex) }" ref="cells" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    wordsData: Array
  },
  computed: {
    words() {
      if (!Array.isArray(this.wordsData)) {
        return [];
      }
      return this.wordsData.map(word => {
        return {
          chars: word.text.split(''),
          orientation: word.orientation,
          x: word.x,
          y: word.y
        };
      });
    },
    findIntersection() {
    if (this.words.length < 2) return ''; // Ensure there are at least two words

    const [word1, word2] = this.words;
    const set1 = new Set(word1.chars);
    const set2 = new Set(word2.chars);
    return [...set1].filter(letter => set2.has(letter)).join('');
  }
  },
  methods: {
    moveToNextCell(event, wordIndex, charIndex) {
      const key = event.key;
      if (key === 'ArrowRight') {
        this.focusNextCell(wordIndex, charIndex);
      } else if (key === 'ArrowLeft') {
        this.focusPrevCell(wordIndex, charIndex);
      } else if (key === 'ArrowDown') {
        this.focusNextRow(wordIndex, charIndex);
      } else if (key === 'ArrowUp') {
        this.focusPrevRow(wordIndex, charIndex);
      }
    },
    focusNextCell(wordIndex, charIndex) {
      if (charIndex < this.words[wordIndex].chars.length - 1) {
        this.$refs.cells[wordIndex][charIndex + 1].focus();
      } else if (wordIndex < this.words.length - 1) {
        const nextWord = this.words[wordIndex + 1];
        if (nextWord.orientation === 'down' && charIndex < nextWord.chars.length) {
          this.$refs.cells[wordIndex + 1][charIndex].focus();
        }
      }
    },
    focusPrevCell(wordIndex, charIndex) {
      if (charIndex > 0) {
        this.$refs.cells[wordIndex][charIndex - 1].focus();
      } else if (wordIndex > 0) {
        const prevWord = this.words[wordIndex - 1];
        if (prevWord.orientation === 'down') {
          this.$refs.cells[wordIndex - 1][prevWord.chars.length - 1].focus();
        }
      }
    },
    focusNextRow(wordIndex, charIndex) {
      if (wordIndex < this.words.length - 1) {
        const nextWord = this.words[wordIndex + 1];
        if (nextWord.orientation === 'down' && charIndex < nextWord.chars.length) {
          this.$refs.cells[wordIndex + 1][charIndex].focus();
        }
      }
    },
    focusPrevRow(wordIndex, charIndex) {
      if (wordIndex > 0) {
        const prevWord = this.words[wordIndex - 1];
        if (prevWord.orientation === 'down') {
          this.$refs.cells[wordIndex - 1][charIndex].focus();
        }
      }
    },
    isIntersection(wordIndex, charIndex) {
      const char = this.words[wordIndex].chars[charIndex];
      if (!char) return false; // Ensure the character exists

      // Keep track of encountered intersection characters
      const intersections = new Set();

      // Check for intersections with other words
      for (let i = 0; i < this.words.length; i++) {
        if (i !== wordIndex && this.words[i].chars[charIndex] === char) {
          // If the character is already encountered, it's not an intersection
          if (intersections.has(char)) {
            return false;
          } else {
            // Otherwise, add it to the set and return true
            intersections.add(char);
            return true;
          }
        }
      }
      return false;
    }
  }
};
</script>

<style scoped>
.crossword {
  display: flex;
  justify-content: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  grid-auto-rows: minmax(40px, auto);
  gap: 1px;
}

.word {
  grid-column: span 2;
  grid-row: span 2;
}

.across {
  grid-column: span 2; /* Adjust as needed for your layout */
}

.down {
  grid-row: span 2; /* Adjust as needed for your layout */
}

.cell {
  width: 100%;
  height: 100%;
}

.cell input {
  width: 100%;
  height: 100%;
  border: 1px solid gray;
  text-align: center;
}

.intersect {
  background-color: #f0f0f0;
}
</style>

