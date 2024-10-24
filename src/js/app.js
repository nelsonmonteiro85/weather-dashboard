// Hamburger menu toggle functionality
const hamburger = document.getElementById('hamburger');
const links = document.querySelector('.links');
const heroSection = document.querySelector('.hero-image'); // Assuming this is the hero section
const mainContent = document.querySelector('main');
const footer = document.querySelector('footer'); // If you have a footer

// Function to apply transition to an element
function applyTransition(element, duration = '0.9s', easing = 'ease') {
    if (element) {
        element.style.transition = `transform ${duration} ${easing}`;
    }
}

// Apply transition to hero elements and main content
applyTransition(heroSection);
applyTransition(mainContent);

if (hamburger) {
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('open');
        links.classList.toggle('open');

        if (links.classList.contains('open')) {
            const linksHeight = links.offsetHeight;

            if (heroSection) heroSection.style.transform = `translateY(${linksHeight}px)`;
            if (mainContent) mainContent.style.transform = `translateY(${linksHeight}px)`;
            if (footer) footer.style.transform = `translateY(${linksHeight}px)`;
        } else {
            if (heroSection) heroSection.style.transform = 'translateY(0)';
            if (mainContent) mainContent.style.transform = 'translateY(0)';
            if (footer) footer.style.transform = 'translateY(0)';
        }
    });
}