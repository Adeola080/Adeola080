document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('appliance-form');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const currencySelect = document.getElementById('currency');
    const costKwhInput = document.getElementById('cost-kwh');
    const applianceNameInput = document.getElementById('appliance-name');
    const powerWattsInput = document.getElementById('power-watts');
    const usageHoursInput = document.getElementById('usage-hours');

    const applianceListSection = document.getElementById('appliance-list-section');
    const applianceTbody = document.getElementById('appliance-tbody');

    const costDaily = document.getElementById('cost-daily');
    const costMonthly = document.getElementById('cost-monthly');
    const costYearly = document.getElementById('cost-yearly');

    const usageDaily = document.getElementById('usage-daily');
    const usageMonthly = document.getElementById('usage-monthly');
    const usageYearly = document.getElementById('usage-yearly');

    const datalist = document.getElementById('appliance-suggestions');

    // Database of common appliances
    const commonAppliances = [
        { name: "Refrigerator", watts: 150 },
        { name: "TV (LED)", watts: 60 },
        { name: "Laptop", watts: 50 },
        { name: "Desktop Computer", watts: 200 },
        { name: "Microwave", watts: 1000 },
        { name: "Coffee Maker", watts: 800 },
        { name: "Washing Machine", watts: 500 },
        { name: "Air Conditioner (Window)", watts: 1000 },
        { name: "Space Heater", watts: 1500 },
        { name: "Lightbulb (LED)", watts: 10 },
        { name: "Lightbulb (Incandescent)", watts: 60 },
        { name: "Ceiling Fan", watts: 70 },
        { name: "Hair Dryer", watts: 1500 },
        { name: "Dishwasher", watts: 1200 },
        { name: "Oven (Electric)", watts: 2000 }
    ];

    // State
    let appliances = [];

    // Initialize Datalist
    function populateDatalist() {
        datalist.innerHTML = '';
        commonAppliances.forEach(app => {
            const option = document.createElement('option');
            option.value = app.name;
            datalist.appendChild(option);
        });
    }

    // Auto-fill watts when an appliance is selected from datalist
    applianceNameInput.addEventListener('input', (e) => {
        const selected = e.target.value;
        const matchedAppliance = commonAppliances.find(app => app.name.toLowerCase() === selected.toLowerCase());

        if (matchedAppliance) {
            powerWattsInput.value = matchedAppliance.watts;
        }
    });

    // Update totals when currency or rate changes
    currencySelect.addEventListener('change', updateUI);
    costKwhInput.addEventListener('input', updateUI);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = applianceNameInput.value.trim();
        const watts = parseFloat(powerWattsInput.value);
        const hours = parseFloat(usageHoursInput.value);

        if (!name || isNaN(watts) || isNaN(hours)) {
            alert('Please fill out all fields correctly.');
            return;
        }

        const newAppliance = {
            id: Date.now().toString(),
            name: name,
            watts: watts,
            hours: hours
        };

        appliances.push(newAppliance);

        // Reset inputs but keep the form structure
        applianceNameInput.value = '';
        powerWattsInput.value = '';
        usageHoursInput.value = '';

        updateUI();
    });

    clearFormBtn.addEventListener('click', () => {
        applianceNameInput.value = '';
        powerWattsInput.value = '';
        usageHoursInput.value = '';
    });

    function deleteAppliance(id) {
        appliances = appliances.filter(app => app.id !== id);
        updateUI();
    }

    // Expose globally for inline onclick handlers in table
    window.deleteAppliance = deleteAppliance;

    function updateUI() {
        const currencySymbol = currencySelect.value;
        const rate = parseFloat(costKwhInput.value) || 0;

        if (appliances.length === 0) {
            applianceListSection.classList.add('hidden');
            return;
        } else {
            applianceListSection.classList.remove('hidden');
        }

        // Render Table
        applianceTbody.innerHTML = '';
        let totalDailyKwh = 0;

        appliances.forEach(app => {
            const dailyKwh = (app.watts * app.hours) / 1000;
            const dailyCost = dailyKwh * rate;

            totalDailyKwh += dailyKwh;

            const tr = document.createElement('tr');

            const nameTd = document.createElement('td');
            nameTd.textContent = app.name;
            tr.appendChild(nameTd);

            const wattsTd = document.createElement('td');
            wattsTd.textContent = app.watts;
            tr.appendChild(wattsTd);

            const hoursTd = document.createElement('td');
            hoursTd.textContent = app.hours;
            tr.appendChild(hoursTd);

            const costTd = document.createElement('td');
            costTd.textContent = `${currencySymbol}${dailyCost.toFixed(2)}`;
            tr.appendChild(costTd);

            const actionTd = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteAppliance(app.id);
            actionTd.appendChild(deleteBtn);
            tr.appendChild(actionTd);

            applianceTbody.appendChild(tr);
        });

        // Calculate Totals
        const totalMonthlyKwh = totalDailyKwh * 30;
        const totalYearlyKwh = totalDailyKwh * 365;

        const totalDailyCost = totalDailyKwh * rate;
        const totalMonthlyCost = totalMonthlyKwh * rate;
        const totalYearlyCost = totalYearlyKwh * rate;

        // Update UI Text
        costDaily.textContent = `${currencySymbol}${totalDailyCost.toFixed(2)}`;
        costMonthly.textContent = `${currencySymbol}${totalMonthlyCost.toFixed(2)}`;
        costYearly.textContent = `${currencySymbol}${totalYearlyCost.toFixed(2)}`;

        usageDaily.textContent = `${totalDailyKwh.toFixed(2)} kWh`;
        usageMonthly.textContent = `${totalMonthlyKwh.toFixed(2)} kWh`;
        usageYearly.textContent = `${totalYearlyKwh.toFixed(2)} kWh`;
    }

    // Run init
    populateDatalist();
});
