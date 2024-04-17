// Ensure A-Frame is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  var scene = document.querySelector('a-scene');
  if (scene.hasLoaded) {
    run();
  } else {
    scene.addEventListener('loaded', run);
  }
});

function run() {
  // Clock Script
  var clockSolved = false;  // Var for when clock is solved
  // Hour and minute hands
  var hourHand = document.querySelector('#hour-hand');
  var minuteHand = document.querySelector('#minute-hand');
  // Digital interpretation of angular time
  var timeDisplay = document.querySelector('#time-display');
  // Interface buttons
  var buttons = {
    addHour: document.querySelector('#add-hour'),
    addMinutes: document.querySelector('#add-minutes'),
    subtractHour: document.querySelector('#subtract-hour'),
    subtractMinutes: document.querySelector('#subtract-minutes')
  };

  // Function that rotates the arms
  function updateRotation(hand, deltaZ, isHour) {
    // Grab current arm's rotation
    let currentRotation = hand.getAttribute('rotation');
    // New rotation for arm
    let newZ = currentRotation.z + deltaZ;
    // Apply the new rotation
    hand.setAttribute('rotation', {x: currentRotation.x, y: currentRotation.y, z: newZ});

    // Hard coded arm length (if hour or minute arm)
    let radius = isHour ? 0.2 : 0.3;
    // Calculate new X and Y coordinates through trig to simulate rotating at a different anchor point than the centre
    let newX = radius * Math.sin(newZ * Math.PI / 180);
    let newY = -radius * Math.cos(newZ * Math.PI / 180);

    // Move the arm to its new location
    hand.setAttribute('position', {x: newX, y: newY, z: 0.05});

    // Calculate the digital time from this new position
    calcTime(hourHand, minuteHand);
  }

  // Function for turning rotation into time
  function calcTime(hourHand, minuteHand) {
    // Hour and minute arm rotations
    let hourRotation = hourHand.getAttribute('rotation').z - 180;
    let minuteRotation = minuteHand.getAttribute('rotation').z - 180;
    // Cap hours and minutes to feasible values on a clock
    let hours = Math.round(-hourRotation / 30) % 12;
    let minutes = Math.round(-minuteRotation / 6) % 60;
    hours = hours || 12;

    // Formatted result for what the current time is (to be displayed to users)
    let currentTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
    console.log(currentTime);

    // Update displayed time and displayed time's colour
    timeDisplay.setAttribute('text', 'value', currentTime);
    if (hours === 12 && minutes === 25) {
      timeDisplay.setAttribute('text', 'color', 'green');
      clockSolved = true;
    } else {
      timeDisplay.setAttribute('text', 'color', 'white');
      clockSolved = false;
    }
  }

  // Button listener initialisation
  buttons.addHour.addEventListener('click', () => updateRotation(hourHand, -30, true));
  buttons.addMinutes.addEventListener('click', () => updateRotation(minuteHand, -30, false));
  buttons.subtractHour.addEventListener('click', () => updateRotation(hourHand, 30, true));
  buttons.subtractMinutes.addEventListener('click', () => updateRotation(minuteHand, 30, false));

  // Default time settings
  updateRotation(hourHand, -150, true); // Set hour hand to point up
  updateRotation(minuteHand, -240, false); // Set minute hand to point up

  // Lock Script
  var lockSolved = false;
  // Lists of all increment and decrement buttons
  const incrementButtons = document.querySelectorAll('.increment');
  const decrementButtons = document.querySelectorAll('.decrement');

  // Function for updating the text colour
  function updateColour() {
    // Select all number elements
    const digits = document.querySelectorAll('.digit');

    // Convert digits to an array and then to a string
    const currentCombination = Array.from(digits).map(digit => {
      const textAttr = digit.getAttribute('text');
      return textAttr ? textAttr.value : '0';  // Always return "something"
    }).join('');

    // Determine the color based on the combination
    const colour = currentCombination === '1212' ? 'green' : 'black';

    // For every digit, change its colour
    digits.forEach(digit => {
      digit.setAttribute('text', 'color', colour);
    });

    // Also mark the lock as solved
    if (currentCombination === '1212') {
      lockSolved = true;
    } else {
      lockSolved = false;
    }
  }

  // Add event listeners to all incremental buttons
  incrementButtons.forEach(button => {
    button.addEventListener('click', function () {
      const digit = button.parentNode.querySelector('.digit');

      // If value exists
      if (digit) {
        // Convert number to text and wraparound so it is locked as a single digit
        let currentValue = parseInt(digit.getAttribute('text').value, 10);
        currentValue = (currentValue + 1) % 10;
        digit.setAttribute('text', 'value', currentValue.toString());
        // Whenever a value is changed, check to see if "1212" is entered
        updateColour();
      }
    });
  });

  // Add event listeners to all decreamental buttons
  decrementButtons.forEach(button => {
    button.addEventListener('click', function () {
      const digit = button.parentNode.querySelector('.digit');

      // Convert nymber to text and wraparound, just as in incremental buttons' cases
      let currentValue = parseInt(digit.getAttribute('text').value, 10);
      currentValue = (currentValue - 1 + 10) % 10;
      digit.setAttribute('text', 'value', currentValue.toString());
      // Update colour
      updateColour();
    });
  });

  updateColour();

  // Function for initialising the exit button
  function setupExitButton() {
    const exitDoor = document.querySelector("#exit_door");
    const btn = document.querySelector("#exit_button");

    // Button event listener
    btn.addEventListener('click', function () {
      // If lock and clock solved, open door when clicked
      if (lockSolved && clockSolved) {
        let garage = document.querySelector('#garage');
        if (garage) {
          garage.play();
          exitDoor.setAttribute('animation', {
            property: 'position',
            dur: 10000,
            from: "-7 2 0",
            to: "-7 6 0"
          });
        }
      } else {
        console.log("Conditions not met: lockSolved:", lockSolved, "clockSolved:", clockSolved);
      }
    });
  }

  setupExitButton();
}
