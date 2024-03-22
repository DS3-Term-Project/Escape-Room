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
      return angle + 90;
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
  