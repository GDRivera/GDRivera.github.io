
const logs = [
    { date: '2025-03-16', message: 'It\'s a win today.' },
    { date: '2025-03-17', message: 'It\'s a win today. Walked for 30 mins.' },
    { date: '2025-03-18', message: 'Another win today. No exercise.' },
    { date: '2025-03-19', message: 'GGs today. Ran 1 mile and walked (25 mins).'},
    { date: '2025-03-20', message: 'Ran 1.14 miles in 14 min. Walked 10 mins. Y otro día donde el diablo pierde, prrrraaa.'},
    { date: '2025-03-21', message: 'GGs. No exercise.'},
    { date: '2025-03-22', message: 'Today is a sad day, but we move forward. At least I got to walk for an hour (2.40 miles which is not bad).'},
    { date: '2025-03-23', message: '🥲. another hour of walking.'},
    { date: '2025-03-24', message: 'GGs. another hour of walking (2.50 miles).'},
    { date: '2025-03-25', message: 'pretau. '},
    { date: '2025-03-26', message: 'pretau. '},
    { date: '2025-03-26', message: 'pretau. '},
    { date: '2025-03-27', message: 'pretau. '},
    { date: '2025-03-28', message: 'pretau. '},
    { date: '2025-03-29', message: 'pretau. '},
    { date: '2025-03-30', message: 'pretau. '},
    { date: '2025-03-31', message: 'pretau. '},
    { date: '2025-04-01', message: 'pretau. '},
    { date: '2025-04-02', message: 'pretau. '},
    { date: '2025-04-03', message: 'pretau. '},
    { date: '2025-04-04', message: 'gg. '},
    { date: '2025-04-05', message: 'gg. '},
    { date: '2025-04-06', message: 'gg. '},
    // Add more logs as needed
];

function displayLogs() {
    const logsContainer = document.querySelector('.logs-container');
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
        const monthGroup = document.createElement('div');
        monthGroup.className = 'log-month-group';
        
        const monthHeader = document.createElement('div');
        monthHeader.className = 'log-month-header';
        monthHeader.innerHTML = `
            <span class="dropdown-arrow">▼</span>
            ${monthYear}
        `;
        
        const logsWrapper = document.createElement('div');
        logsWrapper.className = 'logs-wrapper';
        
        const logsContent = document.createElement('div');
        logsContent.className = 'logs-content';
        
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
            
            logsContent.appendChild(logEntry);
        });
        
        // Collapse all except first month
        if (index !== 0) {
            logsWrapper.classList.add('collapsed');
            monthHeader.classList.add('collapsed');
        }
        
        logsWrapper.appendChild(logsContent);
        monthGroup.appendChild(monthHeader);
        monthGroup.appendChild(logsWrapper);
        logsContainer.appendChild(monthGroup);
        
        // Add click handler
        monthHeader.addEventListener('click', () => {
            toggleLogs(monthHeader, logsWrapper);
        });
        
        // Set initial height for expanded items
        if (index === 0) {
            logsWrapper.style.height = logsContent.offsetHeight + 'px';
        }
    });
}

function toggleLogs(monthHeaderContainer, logsWrapper) {
    const isCollapsed = logsWrapper.classList.contains('collapsed');
    const content = logsWrapper.querySelector('.logs-content');
    
    if (isCollapsed) {
        // Expand
        logsWrapper.classList.remove('collapsed');
        monthHeaderContainer.classList.remove('collapsed');
        // Set the height to the content height
        logsWrapper.style.height = content.offsetHeight + 'px';
    } else {
        // Collapse
        // First set the height explicitly
        logsWrapper.style.height = logsWrapper.offsetHeight + 'px';
        // Force a reflow
        logsWrapper.offsetHeight;
        // Add collapsed class and set height to 0
        logsWrapper.classList.add('collapsed');
        monthHeaderContainer.classList.add('collapsed');
        logsWrapper.style.height = '0';
    }
}

// Set a fixed end date - 90 days from February 15, 2024
const getEndDate = () => {
    const startDate = new Date('2025-04-04').getTime();
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
