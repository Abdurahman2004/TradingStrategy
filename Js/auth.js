// auth.js - Shared authentication functions

// Initialize Firebase (same config as before)
// auth.js - Shared authentication functions

// Initialize Firebase (same config as before)
const firebaseConfig = {
    apiKey: "AIzaSyABCD...",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcd1234..."
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication state
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        const authPages = ['/login.html', '/signup.html', '/password-reset.html'];
        const currentPage = window.location.pathname;
        
        if (user) {
            // User is logged in
            if (authPages.some(page => currentPage.includes(page))) {
                window.location.href = 'home.html';
            }
        } else {
            // User is not logged in
            if (!authPages.some(page => currentPage.includes(page))) {
                window.location.href = 'login.html';
            }
        }
    });
}

// Generate initial trading plan (shared function)
function generateInitialTradingPlan(initialAmount, percentage) {
    const plan = [];
    let currentBalance = initialAmount;
    
    for (let day = 1; day <= 30; day++) {
        const profit = currentBalance * (percentage / 100);
        plan.push({
            day,
            balance: currentBalance,
            profitToBeMade: profit,
            expectedBalance: currentBalance + profit,
            lostMoney: 0,
            savingBalance: profit * 0.5,
            achieved: null
        });
        currentBalance = currentBalance + (profit * 0.5); // 50% reinvestment
    }
    return plan;
}

// Export functions if using modules
// export { auth, db, checkAuthState, generateInitialTradingPlan };

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication state
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        const authPages = ['/login.html', '/signup.html', '/password-reset.html'];
        const currentPage = window.location.pathname;
        
        if (user) {
            // User is logged in
            if (authPages.some(page => currentPage.includes(page))) {
                window.location.href = 'home.html';
            }
        } else {
            // User is not logged in
            if (!authPages.some(page => currentPage.includes(page))) {
                window.location.href = 'login.html';
            }
        }
    });
}

// Generate initial trading plan (shared function)
function generateInitialTradingPlan(initialAmount, percentage) {
    const plan = [];
    let currentBalance = initialAmount;
    
    for (let day = 1; day <= 30; day++) {
        const profit = currentBalance * (percentage / 100);
        plan.push({
            day,
            balance: currentBalance,
            profitToBeMade: profit,
            expectedBalance: currentBalance + profit,
            lostMoney: 0,
            savingBalance: profit * 0.5,
            achieved: null
        });
        currentBalance = currentBalance + (profit * 0.5); // 50% reinvestment
    }
    return plan;
}

// Export functions if using modules
// export { auth, db, checkAuthState, generateInitialTradingPlan };

