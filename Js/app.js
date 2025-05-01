// DOM Elements
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeStyle = document.getElementById('dark-mode-style');
const profileImgNav = document.getElementById('profile-img-nav');
const logoutBtn = document.getElementById('logout-btn');
const notification = document.getElementById('notification');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.desktop-nav');
const desktopViewToggle = document.getElementById('desktop-view-toggle');

// Check for saved user preference for dark mode
if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
}

// Check for desktop mode preference
function checkDesktopMode() {
    const isDesktop = localStorage.getItem('desktopMode') === 'true';
    if (isDesktop) {
        enableDesktopMode();
    }
}

// Toggle desktop mode
function toggleDesktopMode() {
    const isDesktop = localStorage.getItem('desktopMode') !== 'true';
    localStorage.setItem('desktopMode', isDesktop);
    
    if (isDesktop) {
        enableDesktopMode();
    } else {
        disableDesktopMode();
    }
}

// Enable desktop view
function enableDesktopMode() {
    document.documentElement.classList.add('desktop-view');
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.content = 'width=1200';
    }
    document.getElementById('desktopToggleBtn').textContent = 'Mobile View';
}

// Disable desktop view
function disableDesktopMode() {
    document.documentElement.classList.remove('desktop-view');
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1.0';
    }
    document.getElementById('desktopToggleBtn').textContent = 'Desktop View';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkDesktopMode();
    
    // Setup toggle button
    const toggleBtn = document.getElementById('desktopToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleDesktopMode);
    }
});

// Mobile browser detection
function isMobileBrowser() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Reset viewport on page load to prevent persistent desktop view
function resetViewport() {
    if (isMobileBrowser()) {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        }
    }
}

// Dark Mode Toggle
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        if (localStorage.getItem('darkMode') === 'enabled') {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
}

function enableDarkMode() {
    darkModeStyle.removeAttribute('disabled');
    localStorage.setItem('darkMode', 'enabled');
    if (darkModeToggle) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function disableDarkMode() {
    darkModeStyle.setAttribute('disabled', 'true');
    localStorage.setItem('darkMode', null);
    if (darkModeToggle) {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Desktop View Toggle
if (desktopViewToggle) {
    desktopViewToggle.addEventListener('click', () => {
        const isDesktopView = desktopViewToggle.classList.contains('active');
        toggleDesktopView(!isDesktopView);
        desktopViewToggle.classList.toggle('active');
        desktopViewToggle.title = isDesktopView ? 'Switch to Desktop View' : 'Switch to Mobile View';
        
        // Show notification about temporary nature
        showNotification(`Desktop view is ${!isDesktopView ? 'enabled' : 'disabled'}. This setting won't persist after refresh.`);
    });
}

function toggleDesktopView(enable) {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) return;

    if (enable) {
        viewportMeta.content = "width=1200";
    } else {
        viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    }
}

// Mobile Menu Toggle
if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}

// Load User Data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Set profile image or avatar
    const profileImg = document.getElementById('profile-img-nav');
    if (profileImg) {
        if (userData.profileImage) {
            profileImg.src = userData.profileImage;
        } else {
            // Generate avatar based on name
            const name = userData.name || 'User';
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            const colors = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#f72585', '#b5179e', '#560bad', '#7209b7'];
            const color = colors[initials.charCodeAt(0) % colors.length];
            
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(initials.substring(0, 2), 50, 50);
            
            profileImg.src = canvas.toDataURL();
        }
    }
    
    // Set welcome name
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName && userData.name) {
        welcomeName.textContent = userData.name;
    }
    
    // Set profile page data
    if (window.location.pathname.includes('profile.html')) {
        document.getElementById('profile-name').value = userData.name || '';
        document.getElementById('profile-email').value = userData.email || '';
        document.getElementById('profile-initial-amount').value = userData.initialAmount || '';
        document.getElementById('profile-percentage').value = userData.profitPercentage || '';
        
        const profileImagePreview = document.getElementById('profile-image-preview');
        if (userData.profileImage) {
            profileImagePreview.src = userData.profileImage;
        } else {
            // Set default avatar
            const name = userData.name || 'User';
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            const colors = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#f72585', '#b5179e', '#560bad', '#7209b7'];
            const color = colors[initials.charCodeAt(0) % colors.length];
            
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(initials.substring(0, 2), 100, 100);
            
            profileImagePreview.src = canvas.toDataURL();
        }
    }
    
    return userData;
}

// Setup Profile Page
function setupProfilePage() {
    const profileImageUpload = document.getElementById('profile-image-upload');
    const changeImageBtn = document.getElementById('change-image-btn');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelChangesBtn = document.getElementById('cancel-changes-btn');
    const profileImagePreview = document.getElementById('profile-image-preview');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close-modal');
    
    // Change image button
    if (changeImageBtn && profileImageUpload) {
        changeImageBtn.addEventListener('click', () => {
            profileImageUpload.click();
        });
        
        profileImageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profileImagePreview.src = event.target.result;
                    
                    // Save to localStorage temporarily until user clicks save
                    const userData = JSON.parse(localStorage.getItem('userData')) || {};
                    userData.tempProfileImage = event.target.result;
                    localStorage.setItem('userData', JSON.stringify(userData));
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Remove image button
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', () => {
            profileImagePreview.src = '';
            
            // Remove temp image from localStorage
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            delete userData.tempProfileImage;
            delete userData.profileImage;
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Regenerate avatar
            const name = document.getElementById('profile-name').value || 'User';
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            const colors = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#f72585', '#b5179e', '#560bad', '#7209b7'];
            const color = colors[initials.charCodeAt(0) % colors.length];
            
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(initials.substring(0, 2), 100, 100);
            
            profileImagePreview.src = canvas.toDataURL();
        });
    }
    
    // Save profile button
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const name = document.getElementById('profile-name').value;
            const email = document.getElementById('profile-email').value;
            const initialAmount = document.getElementById('profile-initial-amount').value;
            const profitPercentage = document.getElementById('profile-percentage').value;
            const password = document.getElementById('profile-password').value;
            const confirmPassword = document.getElementById('profile-confirm-password').value;
            
            if (!name || !initialAmount || !profitPercentage) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (password && password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            userData.name = name;
            userData.email = email;
            userData.initialAmount = parseFloat(initialAmount);
            userData.profitPercentage = parseFloat(profitPercentage);
            
            if (password) {
                userData.password = password; // In a real app, you would hash this
            }
            
            // Save profile image if changed
            if (userData.tempProfileImage) {
                userData.profileImage = userData.tempProfileImage;
                delete userData.tempProfileImage;
            }
            
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Update profile image in nav
            if (userData.profileImage) {
                const profileImgNav = document.getElementById('profile-img-nav');
                if (profileImgNav) {
                    profileImgNav.src = userData.profileImage;
                }
            }
            
            showNotification('Profile updated successfully', 'success');
            
            // Update trading plan if amounts changed
            if (window.location.pathname.includes('trading.html')) {
                generateTradingPlan();
            }
            
            // Update dashboard
            if (window.location.pathname.includes('home.html')) {
                updateDashboard();
            }
        });
    }
    
    // Cancel changes button
    if (cancelChangesBtn) {
        cancelChangesBtn.addEventListener('click', () => {
            loadUserData();
        });
    }
    
    // Image modal
    if (profileImagePreview) {
        profileImagePreview.addEventListener('click', () => {
            if (profileImagePreview.src) {
                modalImage.src = profileImagePreview.src;
                imageModal.classList.add('active');
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            imageModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    });
}

// Show notification
function showNotification(message, type = 'info') {
    if (notification) {
        notification.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type);
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Setup Wizard Functions
function nextStep(step) {
    const currentStep = document.querySelector('.setup-step.active');
    const nextStep = document.getElementById(`step${step}`);
    
    if (step === 2) {
        const userName = document.getElementById('userName').value;
        if (!userName) {
            alert('Please enter your name');
            return;
        }
    } else if (step === 3) {
        const initialAmount = document.getElementById('initialAmount').value;
        if (!initialAmount) {
            alert('Please select or enter an initial amount');
            return;
        }
    }
    
    currentStep.classList.remove('active');
    nextStep.classList.add('active');
    
    // Update progress indicator
    document.getElementById(`step${step-1}-indicator`).classList.remove('active');
    document.getElementById(`step${step}-indicator`).classList.add('active');
}

function prevStep(step) {
    const currentStep = document.querySelector('.setup-step.active');
    const prevStep = document.getElementById(`step${step}`);
    
    currentStep.classList.remove('active');
    prevStep.classList.add('active');
    
    // Update progress indicator
    const currentStepNum = parseInt(currentStep.id.replace('step', ''));
    document.getElementById(`step${currentStepNum}-indicator`).classList.remove('active');
    document.getElementById(`step${step}-indicator`).classList.add('active');
}

function selectAmount(amount) {
    document.getElementById('initialAmount').value = amount;
    
    // Highlight selected button
    const amountOptions = document.querySelectorAll('.amount-option');
    amountOptions.forEach(option => {
        option.classList.remove('active');
        if (parseInt(option.textContent.replace('$', '')) === amount) {
            option.classList.add('active');
        }
    });
}

function selectPercentage(percentage) {
    document.getElementById('profitPercentage').value = percentage;
    
    // Highlight selected button
    const percentageOptions = document.querySelectorAll('.percentage-option');
    percentageOptions.forEach(option => {
        option.classList.remove('active');
        if (parseInt(option.textContent.replace('%', '')) === percentage) {
            option.classList.add('active');
        }
    });
}

function completeSetup() {
    const userName = document.getElementById('userName').value;
    const initialAmount = document.getElementById('initialAmount').value;
    const profitPercentage = document.getElementById('profitPercentage').value;
    
    if (!userName || !initialAmount || !profitPercentage) {
        alert('Please complete all fields');
        return;
    }
    
    const userData = {
        name: userName,
        initialAmount: parseFloat(initialAmount),
        profitPercentage: parseFloat(profitPercentage),
        tradingPlan: generateInitialTradingPlan(parseFloat(initialAmount), parseFloat(profitPercentage))
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    window.location.href = 'home.html';
}

// Generate initial trading plan
function generateInitialTradingPlan(initialAmount, profitPercentage) {
    const tradingPlan = [];
    let balance = initialAmount;
    
    for (let day = 1; day <= 30; day++) {
        const profitToBeMade = balance * (profitPercentage / 100);
        const expectedBalance = balance + profitToBeMade;
        const savingBalance = profitToBeMade * 0.5;
        
        tradingPlan.push({
            day,
            balance,
            profitToBeMade,
            expectedBalance,
            lostMoney: 0,
            savingBalance,
            achieved: null // null means not set yet
        });
        
        balance = balance + (profitToBeMade - savingBalance);
    }
    
    return tradingPlan;
}

// Update Dashboard
function updateDashboard() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (!userData.tradingPlan || userData.tradingPlan.length === 0) {
        return;
    }
    
    // Calculate totals
    let currentBalance = userData.initialAmount;
    let totalProfit = 0;
    let totalLost = 0;
    let totalSavings = 0;
    let daysCompleted = 0;
    
    for (const day of userData.tradingPlan) {
        if (day.achieved === true) {
            currentBalance = day.expectedBalance - day.lostMoney - day.savingBalance;
            totalProfit += day.profitToBeMade;
            totalLost += day.lostMoney;
            totalSavings += day.savingBalance;
            daysCompleted++;
        } else if (day.achieved === false) {
            totalLost += day.lostMoney;
        }
    }
    
    // Update dashboard displays
    if (document.getElementById('initial-amount-display')) {
        document.getElementById('initial-amount-display').textContent = `$${userData.initialAmount.toFixed(2)}`;
    }
    
    if (document.getElementById('current-balance-display')) {
        document.getElementById('current-balance-display').textContent = `$${currentBalance.toFixed(2)}`;
    }
    
    if (document.getElementById('profit-display')) {
        document.getElementById('profit-display').textContent = `$${totalProfit.toFixed(2)}`;
    }
    
    if (document.getElementById('lost-money-display')) {
        document.getElementById('lost-money-display').textContent = `$${totalLost.toFixed(2)}`;
    }
    
    if (document.getElementById('saving-balance-display')) {
        document.getElementById('saving-balance-display').textContent = `$${totalSavings.toFixed(2)}`;
    }
    
    if (document.getElementById('percentage-display')) {
        document.getElementById('percentage-display').textContent = `${userData.profitPercentage}%`;
    }
    
    if (document.getElementById('days-progress')) {
        const progressPercent = (daysCompleted / 30) * 100;
        document.getElementById('days-progress').style.width = `${progressPercent}%`;
    }
    
    if (document.getElementById('days-completed')) {
        document.getElementById('days-completed').textContent = daysCompleted;
    }
    
    // Update profile stats if on profile page
    if (window.location.pathname.includes('profile.html')) {
        if (document.getElementById('stat-days-completed')) {
            document.getElementById('stat-days-completed').textContent = daysCompleted;
        }
        
        if (document.getElementById('stat-success-rate')) {
            const successRate = daysCompleted > 0 ? (daysCompleted / 30) * 100 : 0;
            document.getElementById('stat-success-rate').textContent = `${successRate.toFixed(1)}%`;
        }
        
        if (document.getElementById('stat-total-profit')) {
            document.getElementById('stat-total-profit').textContent = `$${totalProfit.toFixed(2)}`;
        }
        
        if (document.getElementById('stat-total-savings')) {
            document.getElementById('stat-total-savings').textContent = `$${totalSavings.toFixed(2)}`;
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Reset viewport on every page load
    resetViewport();
    
    loadUserData();
    
    // If on home page, update dashboard
    if (window.location.pathname.includes('home.html')) {
        updateDashboard();
        
        // Reset plan button
        const resetPlanBtn = document.getElementById('reset-plan-btn');
        if (resetPlanBtn) {
            resetPlanBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset your trading plan? This will clear all your progress.')) {
                    const userData = JSON.parse(localStorage.getItem('userData')) || {};
                    userData.tradingPlan = generateInitialTradingPlan(userData.initialAmount, userData.profitPercentage);
                    localStorage.setItem('userData', JSON.stringify(userData));
                    updateDashboard();
                    showNotification('Trading plan reset successfully', 'success');
                }
            });
        }
    }
    
    // If on trading page, setup trading plan
    if (window.location.pathname.includes('trading.html')) {
        // Recalculate button
        const recalculateBtn = document.getElementById('recalculate-btn');
        if (recalculateBtn) {
            recalculateBtn.addEventListener('click', () => {
                generateTradingPlan();
                showNotification('Trading plan recalculated', 'success');
            });
        }
        
        // Save plan button
        const savePlanBtn = document.getElementById('save-plan-btn');
        if (savePlanBtn) {
            savePlanBtn.addEventListener('click', () => {
                saveTradingPlan();
                showNotification('Trading plan saved', 'success');
            });
        }
        
        // Reset plan button
        const resetPlanBtn = document.getElementById('reset-plan-btn');
        if (resetPlanBtn) {
            resetPlanBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset your trading plan? This will clear all your progress.')) {
                    const userData = JSON.parse(localStorage.getItem('userData')) || {};
                    userData.tradingPlan = generateInitialTradingPlan(userData.initialAmount, userData.profitPercentage);
                    localStorage.setItem('userData', JSON.stringify(userData));
                    generateTradingPlan();
                    showNotification('Trading plan reset successfully', 'success');
                }
            });
        }
        
        // Export to Excel button
        const exportPlanBtn = document.getElementById('export-plan-btn');
        if (exportPlanBtn) {
            exportPlanBtn.addEventListener('click', exportToExcel);
        }
        
        // Save notes button
        const saveNotesBtn = document.getElementById('save-notes-btn');
        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => {
                const notes = document.getElementById('trading-notes').value;
                const userData = JSON.parse(localStorage.getItem('userData')) || {};
                userData.tradingNotes = notes;
                localStorage.setItem('userData', JSON.stringify(userData));
                showNotification('Notes saved', 'success');
            });
            
            // Load notes if they exist
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            if (userData.tradingNotes) {
                document.getElementById('trading-notes').value = userData.tradingNotes;
            }
        }
    }
});