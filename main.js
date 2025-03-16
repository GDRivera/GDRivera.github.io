
const logs = [
    { date: '2025-03-16', message: 'This is a test log for today.' },
    { date: '2025-03-16', message: 'This is a test log for today.' },
    { date: '2025-03-16', message: 'This is a test log for today.' },
    // Add more logs as needed
];

function displayLogs() {
    const logsContainer = document.getElementById('logsContainer');
    logsContainer.innerHTML = ''; // Clear existing logs
    
    // Group logs by month and year
    const groupedLogs = {};
    logs.forEach(log => {
        const date = new Date(log.date + 'T12:00:00');
        const monthYear = date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        });
        
        if (!groupedLogs[monthYear]) {
            groupedLogs[monthYear] = [];
        }
        groupedLogs[monthYear].push(log);
    });
    
    // Sort groups by date (newest first)
    const sortedMonths = Object.keys(groupedLogs).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA;
    });
    
    // Create and append groups
    sortedMonths.forEach((monthYear, index) => {
        // Create month group container
        const monthGroup = document.createElement('div');
        monthGroup.className = 'log-month-group';
        
        // Create header container
        const monthHeaderContainer = document.createElement('div');
        monthHeaderContainer.className = 'log-month-header';
        
        // Add dropdown arrow and month text
        monthHeaderContainer.innerHTML = `
            <span class="dropdown-arrow">▼</span>
            <span class="month-text">${monthYear}</span>
        `;
        
        // Create logs container
        const logsWrapper = document.createElement('div');
        logsWrapper.className = 'logs-wrapper';
        // Show first month by default, hide others
        if (index !== 0) {
            logsWrapper.classList.add('collapsed');
            monthHeaderContainer.classList.add('collapsed');
        }
        
        // Add logs for this month
        groupedLogs[monthYear].forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            
            const date = new Date(log.date + 'T12:00:00');
            const formattedDate = date.toLocaleDateString('en-US', {
                day: 'numeric',
                timeZone: 'UTC'
            });
            
            logEntry.innerHTML = `
                <span class="log-date">${formattedDate}</span>
                <span class="log-message">${log.message}</span>
            `;
            
            logsWrapper.appendChild(logEntry);
        });
        
        // Add click handler to header
        monthHeaderContainer.addEventListener('click', () => {
            logsWrapper.classList.toggle('collapsed');
            monthHeaderContainer.classList.toggle('collapsed');
        });
        
        monthGroup.appendChild(monthHeaderContainer);
        monthGroup.appendChild(logsWrapper);
        logsContainer.appendChild(monthGroup);
    });
}

// Set a fixed end date - 90 days from February 15, 2024
const getEndDate = () => {
    const startDate = new Date('2025-03-16').getTime();
    const endDate = startDate + (90 * 24 * 60 * 60 * 1000);
    return endDate;
};

const endDate = getEndDate();

function updateCountdown() {
    const currentTime = new Date().getTime();
    const timeLeft = endDate - currentTime;

    if (timeLeft <= 0) {
        document.querySelector('.countdown').innerHTML = '<h1>Countdown Complete!</h1>';
        localStorage.removeItem('countdownEndDate');
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    updateDigit('days-tens', Math.floor(days / 10));
    updateDigit('days-ones', days % 10);
    updateDigit('hours-tens', Math.floor(hours / 10));
    updateDigit('hours-ones', hours % 10);
    updateDigit('minutes-tens', Math.floor(minutes / 10));
    updateDigit('minutes-ones', minutes % 10);
    updateDigit('seconds-tens', Math.floor(seconds / 10));
    updateDigit('seconds-ones', seconds % 10);
}

function updateDigit(id, number) {
    const element = document.getElementById(id);
    const currentNumber = element.textContent;
    const nextNumber = number.toString();
    
    if (currentNumber !== nextNumber) {
        element.innerHTML = `
            <div class="number new">${nextNumber}</div>
            <div class="number old">${currentNumber}</div>
        `;
        
        // Force a reflow
        element.offsetHeight;
        
        // Clear the animation after it's done
        setTimeout(() => {
            element.textContent = nextNumber;
        }, 300);
    }
}

// Update the countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Audio and animation handling
document.addEventListener('DOMContentLoaded', function() {
    let soundSystem;
    let audioInitialized = false;
    let typingSequence;
    
    // Get DOM elements
    const bonfireButton = document.getElementById('bonfireButton');
    const quoteContainer = document.querySelector('.quote-container');
    
    // Function to initialize audio with user interaction
    function initializeAudio() {
        if (audioInitialized) return;
        
        console.log("Initializing audio system...");
        
        // Create our sound system
        soundSystem = createTypingSoundSystem();
        
        // Force audio context to resume
        if (soundSystem.audioCtx) {
            soundSystem.audioCtx.resume().then(() => {
                console.log("AudioContext resumed successfully");
            }).catch(e => {
                console.error("Failed to resume AudioContext:", e);
            });
        }
        
        // Hide the button immediately
        bonfireButton.style.display = 'none';
        
        // Show the quote container immediately
        quoteContainer.classList.add('visible');
        
        // Start the animation immediately
        startTypingAnimation();
        
        audioInitialized = true;
    }
    
    // Function to start typing animation with sound
    function startTypingAnimation() {
        console.log("Starting typing animation with sound");
        
        // Reset the animation
        const quoteAnimated = document.querySelector('.quote-animated');
        const dot = document.querySelector('.dot');
        
        if (!quoteAnimated || !dot) return;
        
        // Reset animations by removing and re-adding the elements
        const quoteParent = quoteAnimated.parentNode;
        const quoteText = quoteAnimated.textContent;
        const dotText = dot.textContent;
        
        quoteParent.removeChild(quoteAnimated);
        quoteParent.removeChild(dot);
        
        // Force reflow
        void quoteParent.offsetWidth;
        
        // Create new elements
        const newQuoteAnimated = document.createElement('span');
        newQuoteAnimated.className = 'quote-animated';
        newQuoteAnimated.textContent = quoteText;
        
        const newDot = document.createElement('span');
        newDot.className = 'dot';
        newDot.textContent = dotText;
        
        quoteParent.appendChild(newQuoteAnimated);
        quoteParent.appendChild(newDot);
        
        // Start playing sounds with a slight delay to match animation
        setTimeout(() => {
            if (soundSystem) {
                typingSequence = soundSystem.playTypingSequence({
                    duration: 2000,
                    onComplete: function() {
                        console.log("Typing sequence complete");
                    }
                });
            }
        }, 1000); // Keep the same delay
    }
    
    // Add click event to the button
    bonfireButton.addEventListener('click', initializeAudio);
    
    // Initialize logs
    displayLogs();
});