// Define Global Variables
const navbar = document.getElementById('navbar');
const navList = document.getElementById('nav-list');
const sections = document.querySelectorAll('section');
const scrollToTopButton = document.getElementById('scroll-to-top');
const navToggle = document.getElementById('nav-toggle');

// Helper Functions
const isInViewport = (elem) => {
    const rect = elem.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.5
    );
};

// Main Functions
const setActiveSection = () => {
    sections.forEach((section) => {
        const navItem = navList.querySelector(`a[href="#${section.id}"]`);
        if (navItem) {
            if (isInViewport(section)) {
                section.classList.add('your-active-class');
                navItem.classList.add('active');
            } else {
                section.classList.remove('your-active-class');
                navItem.classList.remove('active');
            }
        }
    });
};

const toggleScrollToTopButton = () => {
    scrollToTopButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

const toggleMobileNav = () => {
    navList.classList.toggle('show');
};

// Navbar visibility control
let lastScrollTop = 0;
let hideNavbarTimer;

const hideNavbar = () => {
    navbar.classList.add('hidden');
};

const showNavbar = () => {
    navbar.classList.remove('hidden');
};

const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
        // Scrolling down & past the navbar
        hideNavbar();
    } else {
        // Scrolling up
        showNavbar();
    }

    lastScrollTop = scrollTop;

    // Reset the timer
    clearTimeout(hideNavbarTimer);
    hideNavbarTimer = setTimeout(hideNavbar, 2000);
};

// Make sections collapsible
const toggleSection = (section, button) => {
    section.classList.toggle('collapsed');
    button.textContent = section.classList.contains('collapsed') ? 'Expand' : 'Collapse';
};

// Build the navigation menu dynamically
const buildNav = () => {
    const fragment = document.createDocumentFragment();
    sections.forEach((section) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${section.id}`;
        a.textContent = section.dataset.nav;
        a.classList.add('nav-link');
        li.appendChild(a);
        fragment.appendChild(li);

        // Add collapse functionality (skip for hero section)
        if (section.id !== 'hero') {
            const collapseButton = document.createElement('button');
            collapseButton.textContent = 'Collapse';
            collapseButton.classList.add('collapse-button');
            collapseButton.addEventListener('click', () => toggleSection(section, collapseButton));
            section.appendChild(collapseButton); // Append to the end of the section
        }
    });
    navList.appendChild(fragment);
};

// Event Listeners
window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        handleScroll();
        setActiveSection();
        toggleScrollToTopButton();
    });
});

scrollToTopButton.addEventListener('click', scrollToTop);
navToggle.addEventListener('click', toggleMobileNav);

// Smooth scroll to section when nav link is clicked
navList.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Close mobile menu if it's open
        if (navList.classList.contains('show')) {
            toggleMobileNav();
        }
    }
});

// Show navbar on mouse movement
document.addEventListener('mousemove', () => {
    showNavbar();
    clearTimeout(hideNavbarTimer);
    hideNavbarTimer = setTimeout(hideNavbar, 2000);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    buildNav();
    setActiveSection();
    toggleScrollToTopButton();
    hideNavbarTimer = setTimeout(hideNavbar, 2000);
});

// Performance optimization
const debounce = (func, wait = 20, immediate = true) => {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Use debounce for scroll events
window.addEventListener('scroll', debounce(() => {
    setActiveSection();
    toggleScrollToTopButton();
}));
