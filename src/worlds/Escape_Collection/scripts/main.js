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
            // Because this puzzle was updated, check to see if door should open
            checkPuzzlesAndOpenDoor();
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

  let shelfPuzzleSolved = false;
  // A frame component for the buttons to store the object, direction, and whether the shelf is in motion
  AFRAME.registerComponent('move-shelf', {
    schema: {
      // Shelf entity
      target: {type: 'selector'},
      // Move distance and direction
      distance: {type: 'number', default: 2},
      // Whether the shelf is moving
      moving: {type: 'boolean', default: false},
      // Whether the correct symbol is visible
      state: {type: 'boolean', default: true}
    },

    // Add listener to the button
    init: function() {
      this.el.addEventListener('click', () => {
        // If in motion, do not try to move again (prevents button spam)
        if (this.data.moving) return;
        this.data.moving = true;

        // Calculate new position
        const currentPosition = this.data.target.getAttribute('position');
        const newPosition = currentPosition.x + this.data.distance;

        // Animate shelf
        this.data.target.setAttribute('animation', {
          // Ease the position
          property: 'position',
          // Only applies to X coord
          to: {x: newPosition, y: currentPosition.y, z: currentPosition.z},
          // 1.5 Second animation
          dur: 1200,
          // IDK where I found this but it goes hard- smooths the animation
          easing: 'easeInOutQuad'
        });

        // Wait for animation to complete so people can't spam the button and break it
        this.data.target.addEventListener('animationcomplete', () => {
            // Invert visible symbol state
            this.data.state = !this.data.state;
            // Invert direction
            this.data.distance *= -1;
            // Stop moving
            this.data.moving = false;
            // Check if puzzle solved
            this.checkPuzzleSolution();
            // Log shelf state to console
            // console.log(`${this.data.target.id} state: ${this.data.state}`);
          },
          // Force a single execution to prevent inconsistent state and direction inversions
          {once: true});
      });
    },

    // Function for checking whether or not the puzzle has been solved
    checkPuzzleSolution: function() {
      // Get all shelf states
      const shelf1 = document.querySelector('#shelf_1_button').components['move-shelf'].data.state;
      const shelf2 = document.querySelector('#shelf_2_button').components['move-shelf'].data.state;
      const shelf3 = document.querySelector('#shelf_3_button').components['move-shelf'].data.state;
      const shelf4 = document.querySelector('#shelf_4_button').components['move-shelf'].data.state;

      // Check if puzzle is solved
      if (shelf1 === true && shelf2 === false && shelf3 === true && shelf4 === false) {
        shelfPuzzleSolved = true;
        // Because this puzzle was updated, check to see if door should open
        checkPuzzlesAndOpenDoor();
      } else {
        shelfPuzzleSolved = false;
      }
    }
  });

  // Function for handling door opening and closing when all puzzles are solved
  function checkPuzzlesAndOpenDoor() {
    // Check if puzzles are solved
    if (buttonPuzzleSolved && shelfPuzzleSolved) {
      // Get the door entity
      const door = document.querySelector('#exit_door-2');

      // Raise the door
      door.setAttribute('animation', {
        property: 'position',
        to: `${door.getAttribute('position').x} ${door.getAttribute('position').y + 4} ${door.getAttribute('position').z}`,
        dur: 1000,
        easing: 'linear'
      });
    }
  }

  /************************
     *** LIGHTBULB PUZZLE ***
     ************************/

     const playerPos = CIRCLES.getAvatarRigElement().getAttribute('position');

     const socketPos1 = document.querySelector('#socket1').getAttribute('position');
     const socketPos2 = document.querySelector('#socket2').getAttribute('position');
     const socketPos3 = document.querySelector('#socket3').getAttribute('position');
     const socketPos4 = document.querySelector('#socket4').getAttribute('position');
 
     const bulb1 = document.querySelector('#bulbA1');
     const bulb2 = document.querySelector('#bulbB2');
     const bulb3 = document.querySelector('#bulbC3');
     const bulb4 = document.querySelector('#bulbD4');
 
     var sock1Solved = false;
     var sock2Solved = false;
     var sock3Solved = false;
     var sock4Solved = false;
     var bulbSolved = false;
 
     function calculateDistance(point1, point2) {
         const dx = point2.x - point1.x + 17.5;
         const dy = point2.y - point1.y;
         const dz = point2.z - point1.z + 10;
         return Math.sqrt(dx * dx + dy * dy + dz * dz);
     }
 
     function checkSolved() {
 
         socket1Distance = calculateDistance(playerPos, socketPos1);
         socket2Distance = calculateDistance(playerPos, socketPos2);
         socket3Distance = calculateDistance(playerPos, socketPos3);
         socket4Distance = calculateDistance(playerPos, socketPos4);
 
         if (socket1Distance < 3.0) {
             bulb1.setAttribute('circles-pickup-object', 'dropPosition', '0 0 -0.53');
             bulb1.setAttribute('circles-pickup-object', 'dropRotation', '0 0 0');
         } else {
             bulb1.setAttribute('circles-pickup-object', 'dropPosition', '-2 4.8 0.18');
             bulb1.setAttribute('circles-pickup-object', 'dropRotation', '0 0 180');
         }
 
         if (socket2Distance < 3.0) {
             bulb2.setAttribute('circles-pickup-object', 'dropPosition', '0 0 -0.175');
             bulb2.setAttribute('circles-pickup-object', 'dropRotation', '0 0 0');
         } else {
             bulb2.setAttribute('circles-pickup-object', 'dropPosition', '-3.7 4.8 0.18');
             bulb2.setAttribute('circles-pickup-object', 'dropRotation', '0 0 90');
         }
 
         if (socket3Distance < 3.0) {
             bulb3.setAttribute('circles-pickup-object', 'dropPosition', '0 0 0.175');
             bulb3.setAttribute('circles-pickup-object', 'dropRotation', '0 0 0');
         } else {
             bulb3.setAttribute('circles-pickup-object', 'dropPosition', '17 3.4 0.18');
             bulb3.setAttribute('circles-pickup-object', 'dropRotation', '0 0 -90');
         }
 
         if (socket4Distance < 3.0) {
             bulb4.setAttribute('circles-pickup-object', 'dropPosition', '0 0 0.53');
             bulb4.setAttribute('circles-pickup-object', 'dropRotation', '0 0 0');
         } else {
             bulb4.setAttribute('circles-pickup-object', 'dropPosition', '-7.75 11.75 0.18');
             bulb4.setAttribute('circles-pickup-object', 'dropRotation', '0 0 0');
         }
 
         sock1Solved = ((bulb1.getAttribute('position').x === 0) &&
             (bulb1.getAttribute('position').y === 0) &&
             (bulb1.getAttribute('position').z === -0.53));
 
         sock2Solved = ((bulb2.getAttribute('position').x === 0) &&
             (bulb2.getAttribute('position').y === 0) &&
             (bulb2.getAttribute('position').z === -0.175));
 
         sock3Solved = ((bulb3.getAttribute('position').x === 0) &&
             (bulb3.getAttribute('position').y === 0) &&
             (bulb3.getAttribute('position').z === 0.175));
 
         sock4Solved = ((bulb4.getAttribute('position').x === 0) &&
             (bulb4.getAttribute('position').y === 0) &&
             (bulb4.getAttribute('position').z === 0.53));
 
         bulbSolved = (sock1Solved && sock2Solved && sock3Solved && sock4Solved);
 
         console.log('Player postion: ', playerPos);
         console.log('Distance from socket 1: ', socket1Distance);
         console.log('Distance from socket 2: ', socket2Distance);
         console.log('Distance from socket 3: ', socket3Distance);
         console.log('Distance from socket 4: ', socket4Distance);
         console.log('Socket 1 solved: ', sock1Solved);
         console.log('Socket 2 solved: ', sock2Solved);
         console.log('Socket 3 solved: ', sock3Solved);
         console.log('Socket 4 solved: ', sock4Solved);
         console.log('All sockets solved: ', bulbSolved);
     }
     setInterval(checkSolved, 500);

});
