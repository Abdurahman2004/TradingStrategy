// Generate Trading Plan Table
function generateTradingPlan() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (!userData.tradingPlan || userData.tradingPlan.length === 0) {
        // Generate initial plan if none exists
        userData.tradingPlan = generateInitialTradingPlan(userData.initialAmount, userData.profitPercentage);
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    // Update initial amount and percentage displays
    if (document.getElementById('trading-initial-amount')) {
        document.getElementById('trading-initial-amount').textContent = `$${userData.initialAmount.toFixed(2)}`;
    }
    
    if (document.getElementById('trading-percentage')) {
        document.getElementById('trading-percentage').textContent = `${userData.profitPercentage}%`;
    }
    
    // Generate table rows
    const tableBody = document.getElementById('trading-plan-body');
    tableBody.innerHTML = '';
    
    let currentBalance = userData.initialAmount;
    
    userData.tradingPlan.forEach((dayPlan, index) => {
        const row = document.createElement('tr');
        
        if (dayPlan.achieved === false) {
            row.classList.add('canceled');
        }
        
        // Calculate values based on previous days
        if (index > 0) {
            const prevDay = userData.tradingPlan[index - 1];
            if (prevDay.achieved === true) {
                currentBalance = prevDay.expectedBalance - prevDay.lostMoney - prevDay.savingBalance;
            } else if (prevDay.achieved === false) {
                currentBalance = prevDay.balance - prevDay.lostMoney;
            }
            
            // Update this day's values
            dayPlan.balance = currentBalance;
            dayPlan.profitToBeMade = currentBalance * (userData.profitPercentage / 100);
            dayPlan.expectedBalance = currentBalance + dayPlan.profitToBeMade;
            dayPlan.savingBalance = dayPlan.profitToBeMade * 0.5 - dayPlan.lostMoney;
        }
        
        row.innerHTML = `
            <td>${dayPlan.day}</td>
            <td>$${dayPlan.balance.toFixed(2)}</td>
            <td>$${dayPlan.profitToBeMade.toFixed(2)}</td>
            <td>$${dayPlan.expectedBalance.toFixed(2)}</td>
            <td><input type="number" value="${dayPlan.lostMoney.toFixed(2)}" min="0" step="0.01" class="lost-money-input" data-day="${dayPlan.day}"></td>
            <td>$${dayPlan.savingBalance.toFixed(2)}</td>
            <td>
                <select class="achieved-select" data-day="${dayPlan.day}">
                    <option value="null" ${dayPlan.achieved === null ? 'selected' : ''}>Not Set</option>
                    <option value="true" ${dayPlan.achieved === true ? 'selected' : ''}>Yes</option>
                    <option value="false" ${dayPlan.achieved === false ? 'selected' : ''}>No</option>
                </select>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add this to trading.js to detect changes from profile page
window.addEventListener('storage', function(e) {
    if (e.key === 'userData') {
        const userData = JSON.parse(e.newValue);
        renderTradingPlan(userData.tradingPlan);
        showToast('Trading plan updated from profile changes', 'success');
    }
});

// Modify the render function to ensure first column updates
function renderTradingPlan(plan) {
    const tbody = document.getElementById('tradingPlanBody');
    tbody.innerHTML = '';
    
    plan.forEach(day => {
        const row = document.createElement('tr');
        if (!day.achieved) row.classList.add('not-achieved');
        
        row.innerHTML = `
            <td>${day.day}</td>
            <td>$${day.balance.toFixed(2)}</td>
            <td>$${day.achieved ? day.profitToBeMade.toFixed(2) : '0.00'}</td>
            <td>$${day.achieved ? day.expectedBalance.toFixed(2) : day.balance.toFixed(2)}</td>
            <td><input type="number" min="0" step="0.01" value="${day.lostMoney.toFixed(2)}" 
                 data-day="${day.day}" class="lost-money-input"></td>
            <td>$${day.achieved ? day.savingBalance.toFixed(2) : (0 - day.lostMoney).toFixed(2)}</td>
            <td>
                <select data-day="${day.day}" class="achieved-select">
                    <option value="true" ${day.achieved ? 'selected' : ''}>Yes</option>
                    <option value="false" ${!day.achieved ? 'selected' : ''}>No</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    calculateTotals(plan);
}
    
    
    // Add event listeners to inputs
    document.querySelectorAll('.lost-money-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const day = parseInt(e.target.dataset.day);
            const value = parseFloat(e.target.value) || 0;
            
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            const dayPlan = userData.tradingPlan.find(d => d.day === day);
            
            if (dayPlan) {
                dayPlan.lostMoney = value;
                dayPlan.savingBalance = dayPlan.profitToBeMade * 0.5 - value;
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Update saving balance display
                const row = e.target.closest('tr');
                if (row) {
                    const savingCell = row.querySelector('td:nth-child(6)');
                    if (savingCell) {
                        savingCell.textContent = `$${dayPlan.savingBalance.toFixed(2)}`;
                    }
                }
            }
        });
    });
    
    document.querySelectorAll('.achieved-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const day = parseInt(e.target.dataset.day);
            const value = e.target.value === 'null' ? null : e.target.value === 'true';
            
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            const dayPlan = userData.tradingPlan.find(d => d.day === day);
            
            if (dayPlan) {
                dayPlan.achieved = value;
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Update row styling
                const row = e.target.closest('tr');
                if (row) {
                    if (value === false) {
                        row.classList.add('canceled');
                    } else {
                        row.classList.remove('canceled');
                    }
                }
                
                // Recalculate subsequent days if needed
                if (index < userData.tradingPlan.length - 1) {
                    generateTradingPlan();
                }
            }
        });
    });
}

// Save Trading Plan
function saveTradingPlan() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Update lost money values from inputs
    document.querySelectorAll('.lost-money-input').forEach(input => {
        const day = parseInt(input.dataset.day);
        const value = parseFloat(input.value) || 0;
        
        const dayPlan = userData.tradingPlan.find(d => d.day === day);
        if (dayPlan) {
            dayPlan.lostMoney = value;
            dayPlan.savingBalance = dayPlan.profitToBeMade * 0.5 - value;
        }
    });
    
    // Update achieved values from selects
    document.querySelectorAll('.achieved-select').forEach(select => {
        const day = parseInt(select.dataset.day);
        const value = select.value === 'null' ? null : select.value === 'true';
        
        const dayPlan = userData.tradingPlan.find(d => d.day === day);
        if (dayPlan) {
            dayPlan.achieved = value;
        }
    });
    
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Export to Excel
function exportToExcel() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (!userData.tradingPlan || userData.tradingPlan.length === 0) {
        showNotification('No trading plan to export', 'error');
        return;
    }
    
    // Create CSV content
    let csvContent = "Day #,Balance,Profit to be Made,Expected Balance,Lost Money,Saving Balance,Achieved\n";
    
    userData.tradingPlan.forEach(dayPlan => {
        const achievedStatus = dayPlan.achieved === null ? 'Not Set' : dayPlan.achieved ? 'Yes' : 'No';
        csvContent += `${dayPlan.day},${dayPlan.balance.toFixed(2)},${dayPlan.profitToBeMade.toFixed(2)},${dayPlan.expectedBalance.toFixed(2)},${dayPlan.lostMoney.toFixed(2)},${dayPlan.savingBalance.toFixed(2)},${achievedStatus}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `30-day-trading-plan-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Plan exported successfully', 'success');
}

