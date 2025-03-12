// This file creates and exports a function to play typing sounds
function createTypingSoundSystem() {
  // Create an audio context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;
  
  try {
    audioCtx = new AudioContext();
    // Force immediate resume attempt
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (e) {
    console.error("AudioContext failed to initialize:", e);
    return createFallbackSoundSystem();
  }
  
  // Function to create a warmer, less bright typing sound
  function createTypingSound() {
    try {
      // Create oscillator - using triangle wave for warmer sound
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle'; // Warmer than square wave
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // Lower frequency for less brightness
      
      // Create gain node for volume control
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime); // Slightly lower volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.07); // Slightly longer decay
      
      // Create a filter to reduce high frequencies (brightness)
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200; // Cut high frequencies
      
      // Connect nodes with filter
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      return {
        play: function() {
          try {
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.07); // Slightly longer duration
          } catch (e) {
            console.error("Error playing typing sound:", e);
          }
        },
        setVolume: function(volume) {
          gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        }
      };
    } catch (e) {
      console.error("Error creating typing sound:", e);
      return { play: function() {}, setVolume: function() {} };
    }
  }
  
  // Function to create a dot sound (more distinct but warmer)
  function createDotSound() {
    try {
      // Create oscillator
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle'; // Warmer sound
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Lower pitch for warmth
      
      // Create gain node for volume control
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Slightly lower volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12); // Longer duration
      
      // Create a filter to reduce high frequencies
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1500; // Cut high frequencies
      
      // Connect nodes with filter
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      return {
        play: function() {
          try {
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.12); // Longer duration
          } catch (e) {
            console.error("Error playing dot sound:", e);
          }
        }
      };
    } catch (e) {
      console.error("Error creating dot sound:", e);
      return { play: function() {} };
    }
  }
  
  // Fallback system (also updated for warmer sound)
  function createFallbackSoundSystem() {
    console.log("Using fallback sound system");
    
    function createBeepSound(frequency, duration) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.4;
      
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, duration);
    }
    
    return {
      audioCtx: null,
      createTypingSound: function() {
        return {
          play: function() {
            try {
              createBeepSound(600, 70);
            } catch (e) {
              console.error("Error playing fallback typing sound:", e);
            }
          },
          setVolume: function() {}
        };
      },
      createDotSound: function() {
        return {
          play: function() {
            try {
              createBeepSound(800, 120);
            } catch (e) {
              console.error("Error playing fallback dot sound:", e);
            }
          }
        };
      },
      resume: function() {}
    };
  }
  
  // Add a new function to handle the typing animation with sound
  function playTypingSequence(options) {
    const defaults = {
      duration: 2000, // Reduced from 3000 to 2000 (1 second faster)
      typingSoundInterval: 100,
      onComplete: () => {}
    };
    
    const settings = {...defaults, ...options};
    let soundInterval;
    
    // Start playing typing sounds
    soundInterval = setInterval(() => {
      const typingSound = createTypingSound();
      typingSound.play();
    }, settings.typingSoundInterval);
    
    // Stop sounds after typing animation ends
    setTimeout(() => {
      clearInterval(soundInterval);
      
      // Play a slightly different sound for the dot
      setTimeout(() => {
        const dotSound = createDotSound();
        dotSound.play();
        
        // Call the completion callback
        if (typeof settings.onComplete === 'function') {
          settings.onComplete();
        }
      }, 100);
    }, settings.duration);
    
    return {
      stop: function() {
        clearInterval(soundInterval);
      }
    };
  }
  
  return {
    audioCtx,
    createTypingSound,
    createDotSound,
    playTypingSequence,
    resume: function() {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.error("Error resuming audio context:", e));
      }
    }
  };
} 