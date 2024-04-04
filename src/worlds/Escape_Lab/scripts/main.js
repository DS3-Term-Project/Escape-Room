let isTampering = false;

function checkIfObjectIsHeld() {
  const heldObject = CIRCLES.getPickedUpElement();
  const tamperButton = document.getElementById('tamper-button');
  const uiOverlay = document.getElementById('ui-overlay');
  const clockOverlay = document.getElementById('clock-overlay');
  const timeDisplay = document.getElementById('time-display');
  const lockOverlay = document.getElementById('lock-overlay');

  function hideOverlays() {
    uiOverlay.style.display = 'none';
    clockOverlay.style.display = 'none';
    timeDisplay.style.display = 'none';
    lockOverlay.style.display = 'none';
    if (!isTampering) {
      tamperButton.style.display = 'none';
    }
  }

  if (!isTampering) {
    hideOverlays();
  }

  if (heldObject !== null && (heldObject.id === "Artifact-Clock" || heldObject.id === "Artifact-Briefcase") && !isTampering) {
    tamperButton.style.display = 'block';
    tamperButton.onclick = () => {
      isTampering = true;
      uiOverlay.style.display = 'block';
      tamperButton.style.display = 'none';

      if (heldObject.id === "Artifact-Clock") {
        clockOverlay.style.display = 'block';
        timeDisplay.style.display = 'block';
      } else if (heldObject.id === "Artifact-Briefcase") {
        lockOverlay.style.display = 'flex';
      }
    };
  } else if (!heldObject || (heldObject.id !== "Artifact-Clock" && heldObject.id !== "Artifact-Briefcase")) {
    isTampering = false;
    hideOverlays();
  }
}

setInterval(checkIfObjectIsHeld, 1000);

var clockSolved = false;
document.addEventListener('DOMContentLoaded', (event) => {
  const clockOverlay = document.getElementById('clock-overlay');
  const rect = clockOverlay.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  function calculateTimeFromAngles(hourAngle, minuteAngle) {
    minuteAngle -= 90;
    hourAngle -= 3 * 30; // Each hour is 30 degrees

    // Ensure angles are within 0-360 range after adjustment
    hourAngle = (hourAngle + 360) % 360;
    minuteAngle = (minuteAngle + 360) % 360;

    // Calculate minutes
    let minutes = Math.floor((minuteAngle / 360) * 60); // Use floor to avoid hitting 60

    // Calculate hours, including the partial hour indicated by the minute hand
    let hours = Math.floor((hourAngle / 360) * 12);
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Adjust so 0 becomes 12

    // Adjust minutes to avoid displaying 60
    if (minutes >= 60) {
      minutes = 59; // Ensuring minutes don't display as 60
    }

    // Adjust hours and minutes for display
    const roundedHours = hours.toString().padStart(2, '0');
    const roundedMinutes = minutes.toString().padStart(2, '0');

    // Update the time display div
    const timeDisplay = document.getElementById('time-display');
    timeDisplay.textContent = `${roundedHours}:${roundedMinutes}`;

    // Change color if the time is 12:25 (the code)
    if (timeDisplay.textContent === "12:25") {
      timeDisplay.style.color = 'green';
      clockSolved = true;
      document.querySelector('#ding1').play();
      // openClock(); This function needs to be defined elsewhere or represents an action to open the clock puzzle visually
    } else {
      timeDisplay.style.color = 'black';
    }
  }

  function getRotationDegrees(obj) {
    var matrix = window.getComputedStyle(obj, null).getPropertyValue('transform');
    var angle = 0;
    if (matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }
    return angle + 90; // The original calculation seems off, might need adjustment based on actual usage
  }

  function onMouseUp() {
    const hourAngle = getRotationDegrees(document.getElementById('hour-hand'));
    const minuteAngle = getRotationDegrees(document.getElementById('minute-hand'));
    calculateTimeFromAngles(hourAngle, minuteAngle);
  }

  function rotateHand(handId, event) {
    const hand = document.getElementById(handId);
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    const angleRad = Math.atan2(mouseY, mouseX);
    const angleDeg = angleRad * (180 / Math.PI) + 90;
    hand.style.transform = `rotate(${angleDeg}deg)`;
  }

  ['hour-hand', 'minute-hand'].forEach(handId => {
    document.getElementById(handId).addEventListener('mousedown', function(event) {
      event.preventDefault();
      function onMouseMove(event) {
        rotateHand(handId, event);
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', function mouseUpListener() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', mouseUpListener);
        onMouseUp(); // Calculate and log the time
      });
    });
  });
});

var lockSolved = false;
document.addEventListener('DOMContentLoaded', () => {
  const incrementButtons = document.querySelectorAll('.increment');
  const decrementButtons = document.querySelectorAll('.decrement');

  function updateDigitColor() {
    const digits = document.querySelectorAll('.digit');
    const currentCombination = Array.from(digits).map(digit => digit.textContent).join('');
    const color = currentCombination === '1212' ? 'green' : 'black';

    digits.forEach(digit => {
      digit.style.color = color;
    });

    if (currentCombination === '1212') {
      lockSolved = true;
      document.querySelector('#ding2').play();
      // openCase(); This function needs to be defined elsewhere or represents an action to open the lock puzzle visually
    }
  }

  incrementButtons.forEach(button => {
    button.addEventListener('click', () => {
      const digitDiv = button.nextElementSibling;
      let digit = parseInt(digitDiv.textContent, 10);
      digit = (digit + 1) % 10;
      digitDiv.textContent = digit;
      updateDigitColor();
    });
  });

  decrementButtons.forEach(button => {
    button.addEventListener('click', () => {
      const digitDiv = button.previousElementSibling;
      let digit = parseInt(digitDiv.textContent, 10);
      digit = (digit - 1 + 10) % 10;
      digitDiv.textContent = digit;
      updateDigitColor();
    });
  });

  updateDigitColor();
});

document.addEventListener('DOMContentLoaded', () => {
  const exitDoor = document.querySelector("#exit_door");
  const btn = document.querySelector("#exit_button");

  btn.addEventListener('click', () => {
    if (lockSolved && clockSolved) {
      document.querySelector('#garage').play();
      exitDoor.setAttribute('animation', {
        property: 'position',
        dur: 10000,
        from: "-7 2 0",
        to: "-7 6 0"
      });
    }
  });
});
