+++
title = "Rotation, Bit Precision"
description = "A 2D comparison of angular resolution across different bit depths."
authors = ["Wolfgang"]
weight = 1
date =  2023-12-27
updated = 2025-03-04
+++
# Bit Resolution - Rotation
For storing a 2D rotation as a bit sequence, the bit depth determines the angular resolution of the rotation.

The forumula `360 / 2 ^ bitDepth`
gives the angular resolution in degrees;\
The finest turn possible for a given bit depth.

|   | Bit Depth | Resolution | Steps |
| - | --------- | ---------- | ----- |
| ↓ | 1 bit     | 180°       | 2     |
| ↓ | 2 bits    | 90°        | 4     |
| ↓ | 3 bits    | 45°        | 8     |
| ↓ | 4 bits    | 22.5°      | 16    |
| ↓ | 5 bits    | 11.25°     | 32    |
| ↓ | 6 bits    | 5.625°     | 64    |
| ↓ | 7 bits    | 2.8125°    | 128   |
| ↓ | 8 bits    | 1.40625°   | 256   |
| ↓ | 10 bits   | 0.3515625° | 512   |
| ↓ | 12 bits   | 0.0878906…°| 4096  |
| ↓ | 14 bits   | 0.0219727…°| 16384 |

## Notes
The above example works best on touchscreens just for zooming in and looking closer.

<!-- End of text -->
<noscript>JavaScript is not enabled.</noscript>

<script>
    function rotateSymbols() {

        // Select all rows in the table body
        var table = document.querySelector('table');
        var rows = document.querySelectorAll('table tbody tr');
        var stepLimit = 10
        var duration = 5000; // Duration of the animation in milliseconds

        // This could totally be inline CSS
        var style = document.createElement('style');
        style.innerHTML = `@keyframes rotation {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }`;
        document.head.appendChild(style);

        // Add a progress tag above the table with max: duration
        var progress = document.createElement('progress');
        progress.max = duration;
        progress.value = 0;
        progress.style.width = '3rem';
        table.querySelector('thead tr th').appendChild(progress);

        rows.forEach(function (row) {
            // Find the symbol cell and the bit depth cell
            var symbolCell = row.cells[0];
            var bitDepthCell = row.cells[1];

            // Get the bit depth value
            var bitDepth = parseInt(bitDepthCell.textContent, 10);
            var totalSteps = Math.pow(2, bitDepth); // Total steps for a full rotation
            var stepDegree = 360 / totalSteps; // Degrees per step
            var stepDuration = duration / totalSteps; // Time per step

            var currentStep = 0;

            symbolCell.style.display = 'inline-block'; // Allows rotation
            symbolCell.style.width = '1em'; // Set the width
            symbolCell.style.height = '1em'; // Set the height
            symbolCell.style.verticalAlign = 'top'; // Align the symbol to the top
            symbolCell.style.textAlign = 'center'; // Center the symbol horizontally
            symbolCell.style.borderRadius = '50%'; // Make the symbol round
            symbolCell.style.fontSize = '2em';

            bitDepthCell.style.borderLeft = 'none'; // Remove the left border

            function animateStep() {
                // Let the 8-bit symbol control the progress bar
                if (bitDepth == 6) {
                    progress.value = currentStep * stepDuration;
                }
                var rotation = currentStep * stepDegree;
                symbolCell.style.transform = 'rotate(' + rotation + 'deg)';

                if (currentStep < totalSteps) {
                    currentStep++;
                    if (currentStep >= totalSteps) {
                        currentStep = 0;
                    }
                    setTimeout(animateStep, stepDuration); // Schedule the next step
                }
            }
            if (stepDuration < stepLimit) {
                symbolCell.style.animation = 'rotation ' + duration + 'ms linear infinite';
            } else {
                animateStep(); // Start the animation for examples
            }

        });
    }

    // Run the rotation when the document has fully loaded
    document.addEventListener('DOMContentLoaded', rotateSymbols);
</script>
