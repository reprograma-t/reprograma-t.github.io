const sections = document.querySelectorAll('.manifesto-section');
let currentSectionIndex = 0;

const lineDelay = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--line-delay'));
const sectionDelay = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--section-delay'));
const transitionSpeed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-speed'));

function showSection(index) {
    if (index >= sections.length) {
        console.log('End of manifesto');
        // Optionally do something at the very end, e.g., show a final message or loop
        return;
    }

    const currentSection = sections[index];
    const previousSection = sections[index - 1];

    if (previousSection) {
        previousSection.classList.remove('active');
    }

    currentSection.classList.add('active');

    // Section-specific animations
    if (currentSection.id === 'goal') {
        const glitchContainer = currentSection.querySelector('.glitch-container');
        glitchContainer.classList.add('active');
    } else if (currentSection.id === 'struggle-future') {
        const overlayPhrases = currentSection.querySelectorAll('.overlay-phrase');
        overlayPhrases.forEach((phrase, i) => {
            setTimeout(() => {
                phrase.classList.add('visible');
            }, i * 500); // Stagger overlay phrase reveal
        });
    } else if (currentSection.id === 'transformation') {
        const productItems = currentSection.querySelectorAll('.product-item');
        productItems.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, i * 300 + 1000); // Stagger product item reveal after lines
        });
    } else if (currentSection.id === 'process') {
        // Typing effect handled below with lines
    } else if (currentSection.id === 'climax') {
        // CSS transition handles background/color change on 'active'
    } else if (currentSection.id === 'ending') {
        // CSS transitions handle logo and tagline animations on 'active'
        const taglineWords = currentSection.querySelectorAll('.tagline-word');
        // Trigger CSS animations by ensuring they have the class (added by active)
        // No need for manual timeouts here if CSS handles delay
    }

    const lines = currentSection.querySelectorAll('.line');
    let totalLineAnimationTime = 0;

    lines.forEach((line, i) => {
        const lineElementsToAnimate = line.id === 'process' ? [line] : [line]; // Handle typing differently if needed later

        lineElementsToAnimate.forEach(el => {
            let delay = i * lineDelay;
            if (currentSection.id === 'process') {
                // Calculate delay for typing lines based on previous line's animation duration
                if (i > 0) {
                    const prevLine = lines[i - 1];
                    const prevTextLength = prevLine.textContent.length;
                    const typingDuration = prevTextLength * 50; // Estimate typing speed (ms per char)
                    delay = totalLineAnimationTime + typingDuration + 500; // Add small buffer
                } else {
                    delay = lineDelay; // First line delay
                }
                totalLineAnimationTime = delay; // Update total time after this line
            } else {
                delay = i * lineDelay;
            }

            setTimeout(() => {
                el.classList.add('visible');
                if (currentSection.id === 'process' && el.classList.contains('line')) {
                    // Trigger typing animation *after* the line is visible and positioned
                    // Use a small delay to ensure 'visible' transition finishes
                    setTimeout(() => {
                        el.classList.add('typing');
                        const typingDuration = el.textContent.length * 50; // Estimate typing speed (ms per char)
                        // Remove typing class after animation is done to hide cursor
                        setTimeout(() => {
                            el.classList.remove('typing');
                        }, typingDuration + 100);
                    }, 50); // Small delay after visible class
                }

            }, delay);
        });
    });

    // Calculate duration for this section before moving to the next
    // This needs to account for the last line animation + any section-specific animations + the sectionDelay
    let sectionDuration = 0;
    if (currentSection.id === 'process') {
        sectionDuration = totalLineAnimationTime + 1000; // Typing takes longer, add buffer
    } else if (currentSection.id === 'ending') {
        // Calculate based on the last CTA line + its animation duration + ending specific animations
        const lastLineIndex = lines.length - 1;
        const lastLineDelay = lastLineIndex * lineDelay;
        sectionDuration = lastLineDelay + transitionSpeed * 1000 + 3500; // Last line delay + line anim + logo/tagline anim time + buffer
    } else {
        const lastLineIndex = lines.length - 1;
        const lastLineDelay = lastLineIndex * lineDelay;
        sectionDuration = lastLineDelay + transitionSpeed * 1000; // Last line delay + line animation duration
        if (currentSection.id === 'transformation') {
            sectionDuration += 1500; // Add extra time for product items
        }
    }

    setTimeout(() => {
        // Remove glitch effect from the goal section before moving on
        if (currentSection.id === 'goal') {
            currentSection.querySelector('.glitch-container').classList.remove('active');
        }
        // Optional: remove 'visible' from lines for transition effect or if returning
        // lines.forEach(line => line.classList.remove('visible', 'typing')); // uncomment to reset lines

        showSection(index + 1);
    }, sectionDuration + sectionDelay * 1000); // Add section delay before showing the next section

}

// Start the manifesto sequence
document.addEventListener('DOMContentLoaded', () => {
    // Use a small initial delay before the first section appears
    setTimeout(() => {
        showSection(currentSectionIndex);
    }, sectionDelay * 500); // Smaller delay for the very first section
});
