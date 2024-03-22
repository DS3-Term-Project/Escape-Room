
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

// Set up an interval to periodically check for a held object
setInterval(checkIfObjectIsHeld, 1000);