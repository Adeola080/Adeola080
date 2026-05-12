document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('energy-form');
    const resetBtn = document.getElementById('reset-btn');
    const resultsSection = document.getElementById('results');

    // Display elements
    const displayAppliance = document.getElementById('display-appliance');

    // Cost display elements
    const costDaily = document.getElementById('cost-daily');
    const costMonthly = document.getElementById('cost-monthly');
    const costYearly = document.getElementById('cost-yearly');

    // Usage display elements
    const usageDaily = document.getElementById('usage-daily');
    const usageMonthly = document.getElementById('usage-monthly');
    const usageYearly = document.getElementById('usage-yearly');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get input values
        const applianceName = document.getElementById('appliance-name').value.trim();
        const powerWatts = parseFloat(document.getElementById('power-watts').value);
        const hoursPerDay = parseFloat(document.getElementById('usage-hours').value);
        const costPerKwh = parseFloat(document.getElementById('cost-kwh').value);

        // Validation (basic HTML5 handles most, but just to be safe)
        if (isNaN(powerWatts) || isNaN(hoursPerDay) || isNaN(costPerKwh)) {
            alert('Please enter valid numbers for power, usage, and cost.');
            return;
        }

        // Calculations
        // 1. Daily energy in kWh = (Watts * Hours) / 1000
        const dailyKwh = (powerWatts * hoursPerDay) / 1000;

        // 2. Monthly (assuming 30 days) and Yearly (365 days)
        const monthlyKwh = dailyKwh * 30;
        const yearlyKwh = dailyKwh * 365;

        // 3. Costs
        const dailyCost = dailyKwh * costPerKwh;
        const monthlyCost = monthlyKwh * costPerKwh;
        const yearlyCost = yearlyKwh * costPerKwh;

        // Format and display results
        displayAppliance.textContent = applianceName ? `for: ${applianceName}` : '';

        // Update costs
        costDaily.textContent = `$${dailyCost.toFixed(2)}`;
        costMonthly.textContent = `$${monthlyCost.toFixed(2)}`;
        costYearly.textContent = `$${yearlyCost.toFixed(2)}`;

        // Update usages
        usageDaily.textContent = `${dailyKwh.toFixed(2)} kWh`;
        usageMonthly.textContent = `${monthlyKwh.toFixed(2)} kWh`;
        usageYearly.textContent = `${yearlyKwh.toFixed(2)} kWh`;

        // Show the results section
        resultsSection.classList.remove('hidden');
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        resultsSection.classList.add('hidden');
        displayAppliance.textContent = '';

        // Reset display values
        costDaily.textContent = '$0.00';
        costMonthly.textContent = '$0.00';
        costYearly.textContent = '$0.00';

        usageDaily.textContent = '0.00 kWh';
        usageMonthly.textContent = '0.00 kWh';
        usageYearly.textContent = '0.00 kWh';
    });
});
