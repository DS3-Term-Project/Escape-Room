document.addEventListener('DOMContentLoaded', () => {
  /**
   * Button Puzzle: Codes are hidden in both the collections room and the lab, of which players must enter
   * */

  let buttonPuzzleSolved = false;

  // Button container element
  const buttonGrid = document.querySelector('#buttonGrid');
  // Storage for all buttons
  const buttons = buttonGrid.querySelectorAll('[id^="puzzleButton"]');
  // Sequence that player is currently entering
  let currentSequence = new Set();
  // Default colour is red
  let currentColor = 'red';

  // All stored pinpad sequences
  const sequences = {
    red: new Set([1, 3, 5, 9]),
    blue: new Set([1, 4, 7, 8, 9]),
    green: new Set([1, 2, 3, 4, 6, 9]),
    yellow: new Set([2, 4, 6, 7, 8, 9])
  };

  // Function for resetting all buttons back to first sequence (when player gets sequence wrong)
  function resetButtons() {
    // For every button, set to red
    buttons.forEach(button => {
      button.setAttribute('circles-button', 'pedastal_color:rgb(74, 87, 95); button_color:rgb(255, 0, 0); button_color_hover:rgb(255, 255, 255);');
    });
    // Reset sequence
    currentSequence.clear();
    currentColor = 'red';
  }

  // Function for changing the colour of all buttons
  function changeColor(nextColor) {
    // Log colour change (for testing)
    // console.log(`Changing color to ${nextColor}`);
    currentColor = nextColor;
    const color = getColor(nextColor);
    // Apply colour change to all buttons
    buttons.forEach(button => {
      button.setAttribute('circles-button', `pedastal_color:rgb(74, 87, 95); button_color:${color}; button_color_hover:rgb(255, 255, 255);`);
    });
    // Reset sequence
    currentSequence.clear();
  }

  // Function for storing colours
  function getColor(color) {
    // All colours
    const colors = {
      white: 'rgb(255, 255, 255)',
      red: 'rgb(255, 0, 0)',
      blue: 'rgb(0, 0, 255)',
      green: 'rgb(0, 255, 0)',
      yellow: 'rgb(255, 255, 0)'
    };
    // Return requested colour
    return colors[color];
  }

  // Add eventlisteners to the buttons
  buttons.forEach((button, index) => {
    // When clicked
    button.addEventListener('click', () => {
      // If puzzle already solved, skip
      if (buttonPuzzleSolved) return;
      // Store button ID in pinpad
      const buttonId = index + 1;
      // If button is permitted
      if (sequences[currentColor].has(buttonId)) {
        // Set button to white (correctly selected)
        button.setAttribute('circles-button', `pedastal_color:rgb(74, 87, 95); button_color:rgb(255, 255, 255); button_color_hover:rgb(255, 255, 255);`);
        // Add button to sequence
        currentSequence.add(buttonId);
        // If sequence is completed
        if (currentSequence.size === sequences[currentColor].size && isSubsetOf(sequences[currentColor], currentSequence)) {
          // If user just completed the final sequence
          if (currentColor === 'yellow') {
            changeColor('white');
            buttonPuzzleSolved = true;
            return;
          }
          // If not solved, move to next colour and sequence
          const nextColor = { red: 'blue', blue: 'green', green: 'yellow' }[currentColor];
          changeColor(nextColor);
        }
      }
      // If incorrect, reset all buttons
      else {
        resetButtons();
      }
    });
  });

  // Function for checking if an element is in the set (sequence)
  function isSubsetOf(set, subset) {
    // For every element in the sequence
    for (let elem of subset) {
      // If element is not in the sequence, return false
      if (!set.has(elem)) {
        return false;
      }
    }
    return true;
  }

  // Reset buttons to default on load
  resetButtons();

  /**
   * Shelf Puzzle: Players must move shelves around to reveal symbols such that they align with their riddle
   * */

  let shelfPuzzleSolved = false;


});
