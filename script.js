// Calculate the damage to each object based on method
function setupDynamicUpdates() {
    const raidInputs = document.querySelectorAll('#raidSelection input[type="number"]');
    const spreadsheetInputs = document.querySelectorAll('#spreadsheet input');
    
    // Function to recompute data when any relevant field changes
    function recompute() {
        const { totals, coeffs } = computeIncludedData();

        var finalDestructivePower = totals.metalGateTotal*10000

        // Get user-defined raid requirements
        const woodenGateNeeded = parseFloat(document.getElementById('woodenGate').value) || 0;
        const metalGateNeeded = parseFloat(document.getElementById('metalGate').value) || 0;
        const gateFrameNeeded = parseFloat(document.getElementById('gateFrame').value) || 0;
        const woodenWallNeeded = parseFloat(document.getElementById('woodenWall').value) || 0;
        const metalWallNeeded = parseFloat(document.getElementById('metalWall').value) || 0;

        // Check if the available totals meet or exceed the required amounts
        // Also multiply by 10000 arbitrarily
        // Check if the available totals meet or exceed the required amounts
        const canRaid =
            ((woodenGateNeeded * coeffs.woodenGateCoeff) +
                (metalGateNeeded * coeffs.metalGateCoeff) +
                (gateFrameNeeded * coeffs.gateFrameCoeff) +
                (woodenWallNeeded * coeffs.woodenWallCoeff) +
                (metalWallNeeded * coeffs.metalWallCoeff)) * 10000 <= finalDestructivePower;

        // Update raid status
        const raidStatus = document.getElementById('raidStatus');
        if (canRaid) {
            raidStatus.textContent = 'Yes, you can raid!';
            raidStatus.style.color = 'lime';
        } else {
            raidStatus.textContent = 'No, not enough resources.';
            raidStatus.style.color = 'red';
        }
    }

    // Add event listeners to all relevant inputs
    raidInputs.forEach(input => {
        input.addEventListener('input', recompute);
    });

    spreadsheetInputs.forEach(input => {
        input.addEventListener('input', recompute);
    });

    // Initial computation to set up the page state
    recompute();
}

function computeIncludedData() {
    const rows = document.querySelectorAll('#spreadsheet tbody tr');
    
    // Initialize totals
    let woodenGateTotal = 0;
    let metalGateTotal = 0;
    let gateFrameTotal = 0;
    let woodenWallTotal = 0;
    let metalWallTotal = 0;

    // Initialize coeffs
    let woodenGateCoeff = 0;
    let metalGateCoeff = 0;
    let gateFrameCoeff = 0;
    let woodenWallCoeff = 0;
    let metalWallCoeff = 0;

    const includedData = []; // Array to store the new data structure

    rows.forEach(row => {
        const checkbox = row.querySelector('td:nth-child(9) input[type="checkbox"]');
        if (checkbox.checked) {
            // Read data from the row
            const amount = parseFloat(row.querySelector('td:nth-child(3) input').value) || 0;
            const woodenGate = parseFloat(row.querySelector('td:nth-child(4) input').value) || 0;
            const metalGate = parseFloat(row.querySelector('td:nth-child(5) input').value) || 0;
            const gateFrame = parseFloat(row.querySelector('td:nth-child(6) input').value) || 0;
            const woodenWall = parseFloat(row.querySelector('td:nth-child(7) input').value) || 0;
            const metalWall = parseFloat(row.querySelector('td:nth-child(8) input').value) || 0;

            // Compute the ratios
            const woodenGateRatio = woodenGate > 0 ? amount / woodenGate : 0;
            const metalGateRatio = metalGate > 0 ? amount / metalGate : 0;
            const gateFrameRatio = gateFrame > 0 ? amount / gateFrame : 0;
            const woodenWallRatio = woodenWall > 0 ? amount / woodenWall : 0;
            const metalWallRatio = metalWall > 0 ? amount / metalWall : 0;

            // Add the ratios to the totals
            woodenGateTotal += woodenGateRatio;
            metalGateTotal += metalGateRatio;
            gateFrameTotal += gateFrameRatio;
            woodenWallTotal += woodenWallRatio;
            metalWallTotal += metalWallRatio;

            // Store the data for this row
            includedData.push({
                method: row.querySelector('td:nth-child(2) input').value, // e.g., ".308 Win"
                woodenGateRatio,
                metalGateRatio,
                gateFrameRatio,
                woodenWallRatio,
                metalWallRatio
            });
        }
    });

    // Add totals to the result
    const totals = {
        woodenGateTotal,
        metalGateTotal,
        gateFrameTotal,
        woodenWallTotal,
        metalWallTotal
    };

    // Update coeffs in terms of metal gate
    woodenGateCoeff = totals.metalGateTotal/totals.woodenGateTotal;
    metalGateCoeff = totals.metalGateTotal/totals.metalGateTotal;
    gateFrameCoeff = totals.metalGateTotal/totals.gateFrameTotal;
    woodenWallCoeff = totals.metalGateTotal/totals.woodenWallTotal;
    metalWallCoeff = totals.metalGateTotal/totals.metalWallTotal;

    // Add coeffs to the result
    const coeffs = {
        woodenGateCoeff,
        metalGateCoeff,
        gateFrameCoeff,
        woodenWallCoeff,
        metalWallCoeff
    }

    return { includedData, totals, coeffs };
}

function computeAndUpdate() {
    const { includedData, totals } = computeIncludedData();

    // Multiply by an arbitrary number to make the final calc more accurate
    var finalDestructivePower = totals.metalGateTotal*10000


    // Log results for debugging
    // console.log("Included Data:", includedData);
    console.log(finalDestructivePower);

    // Use totals to update UI elements or perform further calculations
}

// Call this function after generating rows
setupDynamicUpdates();