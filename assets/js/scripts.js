const jobTitles = ['Full-Stack Developer', 'Machine Learning Engineer'];
let index = 0;
let charIndex = 0;
let isDeleting = false;

/**
 * Types out job titles one character at a time on a web page.
 * @async
 */
async function typeJobTitle() {
  const title = jobTitles[index];
  const element = document.getElementById('job-title');

  if (isDeleting) {
    // Deleting characters
    element.textContent = title.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      // Switch to the next job title
      isDeleting = false;
      index = (index + 1) % jobTitles.length;
    }
  } else {
    // Typing characters
    element.textContent = title.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === title.length) {
      // Switch to deleting mode and pause before next title
      isDeleting = true;
      await pauseBeforeDelete(2000);
    }
  }

  const typingSpeed = isDeleting ? 50 : 100;
  setTimeout(typeJobTitle, typingSpeed);
}

/**
 * Pauses execution for a specified amount of time.
 * @param {number} ms - The amount of time to pause in milliseconds.
 * @returns {Promise} - A promise that resolves after the specified amount of time has passed.
 */
function pauseBeforeDelete(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start the typing animation
typeJobTitle();
