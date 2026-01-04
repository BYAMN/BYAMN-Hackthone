// API Configuration
const API_ENDPOINT = 'https://sheetdb.io/api/v1/wosxpgxr0u76m';

// Utility Functions
const utils = {
    // Get URL parameter by name
    getUrlParameter: function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    // Format date to readable format
    formatDate: function(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    // Create DOM element with attributes
    createElement: function(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            if (key === 'text') {
                element.textContent = attributes[key];
            } else if (key === 'html') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    },

    // Show loading state
    showLoading: function(containerId, message = 'Loading...') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="loading">${message}</div>`;
        }
    },

    // Show error state
    showError: function(containerId, message = 'An error occurred. Please try again.') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    },

    // Remove HTML tags and truncate text
    truncateText: function(html, maxLength = 200) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
};

// API Service
const apiService = {
    // Fetch all hackathons from API
    fetchHackathons: async function() {
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching hackathons:', error);
            throw error;
        }
    },

    // Find hackathon by slug
    findHackathonBySlug: function(hackathons, slug) {
        return hackathons.find(hackathon => hackathon.slug === slug) || null;
    }
};

// Countdown Calculator
const countdownCalculator = {
    // Calculate days left until deadline
    calculateDaysLeft: function(deadline) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff < 0) {
            return 'Closed';
        } else if (daysDiff === 0) {
            return 'Today';
        } else {
            return `${daysDiff} days left`;
        }
    }
};

// UI Renderer
const uiRenderer = {
    // Render hackathon cards on listing page
    renderHackathonList: function(hackathons) {
        const hackathonList = document.getElementById('hackathonList');
        if (!hackathonList) return;

        if (hackathons.length === 0) {
            hackathonList.innerHTML = '<div class="error-message">No hackathons found.</div>';
            return;
        }

        // Extract unique tags for filtering
        const tagsSet = new Set();
        hackathons.forEach(hackathon => {
            if (hackathon.tags) {
                hackathon.tags.split(',').map(tag => tag.trim()).forEach(tag => {
                    if (tag) tagsSet.add(tag);
                });
            }
        });

        // Render filter tags
        this.renderFilterTags(Array.from(tagsSet), hackathons);

        // Render hackathon cards
        const fragment = document.createDocumentFragment();
        hackathons.forEach(hackathon => {
            const card = this.createHackathonCard(hackathon);
            fragment.appendChild(card);
        });
        
        hackathonList.innerHTML = '';
        hackathonList.appendChild(fragment);
    },

    // Create individual hackathon card
    createHackathonCard: function(hackathon) {
        const daysLeft = countdownCalculator.calculateDaysLeft(hackathon.deadline);
        
        // Determine card styling based on days left
        let daysLeftClass = 'days-left';
        if (daysLeft === 'Closed') {
            daysLeftClass += ' closed';
        } else if (daysLeft === 'Today') {
            daysLeftClass += ' today';
        }

        const card = utils.createElement('a', {
            href: `hackathon.html?slug=${hackathon.slug}`,
            className: 'hackathon-card'
        });

        const banner = utils.createElement('img', {
            src: hackathon.banner || 'https://via.placeholder.com/300x180?text=No+Image',
            alt: hackathon.title,
            className: 'card-banner'
        });

        const content = utils.createElement('div', { className: 'card-content' });

        const title = utils.createElement('h3', { className: 'card-title' }, [hackathon.title]);
        
        const organizer = utils.createElement('span', { 
            className: 'card-organizer' 
        }, [hackathon.organizer]);
        
        const prize = utils.createElement('div', { 
            className: 'card-prize' 
        }, [`Prize: ${hackathon.prize || 'TBD'}`]);

        // Create tags container
        const tagsContainer = utils.createElement('div', { className: 'card-tags' });
        if (hackathon.tags) {
            hackathon.tags.split(',').map(tag => tag.trim()).filter(tag => tag).forEach(tag => {
                const tagElement = utils.createElement('span', { className: 'tag' }, [tag]);
                tagsContainer.appendChild(tagElement);
            });
        }

        // Days left
        const daysLeftElement = utils.createElement('div', { 
            className: daysLeftClass 
        }, [daysLeft]);

        // Append elements
        content.appendChild(title);
        content.appendChild(organizer);
        content.appendChild(prize);
        content.appendChild(tagsContainer);
        content.appendChild(daysLeftElement);
        
        card.appendChild(banner);
        card.appendChild(content);
        
        return card;
    },

    // Render filter tags
    renderFilterTags: function(tags, hackathons) {
        const filterTags = document.querySelector('.filter-tags');
        if (!filterTags) return;

        // Clear existing tags
        filterTags.innerHTML = '';

        // Add "All" tag
        const allTag = utils.createElement('button', {
            className: 'tag-filter active',
            onclick: 'filterHackathons("", ' + JSON.stringify(hackathons) + ')'
        }, ['All']);
        filterTags.appendChild(allTag);

        // Add individual tags
        tags.forEach(tag => {
            const tagElement = utils.createElement('button', {
                className: 'tag-filter',
                onclick: `filterHackathons("${tag}", ${JSON.stringify(hackathons)})`
            }, [tag]);
            filterTags.appendChild(tagElement);
        });
    },

    // Render hackathon detail page
    renderHackathonDetail: function(hackathon) {
        if (!hackathon) {
            utils.showError('hackathonList', 'Hackathon not found.');
            return;
        }

        // Update page title
        document.title = `${hackathon.title} | BYAMN Hackathons`;

        // Update header
        document.getElementById('hackathonTitle').textContent = hackathon.title;

        // Update banner
        const bannerImg = document.getElementById('hackathonBanner');
        bannerImg.src = hackathon.banner || 'https://via.placeholder.com/1200x400?text=No+Image';
        bannerImg.alt = hackathon.title;

        // Update basic info
        document.getElementById('hackathonOrganizer').textContent = hackathon.organizer || 'TBD';
        document.getElementById('hackathonTeamSize').textContent = hackathon.team_size || 'TBD';
        document.getElementById('hackathonMode').textContent = hackathon.mode || 'TBD';
        document.getElementById('hackathonDeadline').textContent = utils.formatDate(hackathon.deadline) || 'TBD';
        document.getElementById('hackathonPrize').textContent = hackathon.prize || 'TBD';

        // Update about section
        document.getElementById('hackathonAbout').innerHTML = hackathon.about || '<p>No information available.</p>';

        // Update stages
        document.getElementById('hackathonStages').innerHTML = hackathon.stages || '<p>No stages information available.</p>';

        // Update rewards
        document.getElementById('hackathonRewards').innerHTML = hackathon.rewards || '<p>No rewards information available.</p>';

        // Update contact
        document.getElementById('hackathonContact').innerHTML = hackathon.contact || '<p>No contact information available.</p>';

        // Update register button
        const registerButton = document.getElementById('registerButton');
        const daysLeft = countdownCalculator.calculateDaysLeft(hackathon.deadline);
        
        if (daysLeft === 'Closed') {
            registerButton.disabled = true;
            registerButton.textContent = 'Registrations Closed';
        } else {
            registerButton.disabled = false;
            registerButton.textContent = 'Register Now';
        }
    }
};

// Filter Functionality
function filterHackathons(selectedTag, hackathons) {
    // Update active state of filter buttons
    document.querySelectorAll('.tag-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter hackathons
    let filteredHackathons = hackathons;
    if (selectedTag) {
        filteredHackathons = hackathons.filter(hackathon => {
            if (!hackathon.tags) return false;
            return hackathon.tags.split(',').map(tag => tag.trim()).includes(selectedTag);
        });
    }

    // Re-render list with filtered hackathons
    uiRenderer.renderHackathonList(filteredHackathons);
}

// Search Functionality
function setupSearch(hackathons) {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (!searchTerm) {
            uiRenderer.renderHackathonList(hackathons);
            return;
        }

        const filteredHackathons = hackathons.filter(hackathon => 
            hackathon.title.toLowerCase().includes(searchTerm) ||
            hackathon.organizer.toLowerCase().includes(searchTerm) ||
            (hackathon.tags && hackathon.tags.toLowerCase().includes(searchTerm))
        );

        uiRenderer.renderHackathonList(filteredHackathons);
    });
}

// Register Button Handler
function openRegistration() {
    const hackathonSlug = utils.getUrlParameter('slug');
    if (!hackathonSlug) return;

    apiService.fetchHackathons().then(hackathons => {
        const hackathon = apiService.findHackathonBySlug(hackathons, hackathonSlug);
        if (hackathon && hackathon.register_url) {
            window.open(hackathon.register_url, '_blank', 'noopener,noreferrer');
        }
    }).catch(error => {
        utils.showError('hackathonList', 'Unable to process registration. Please try again.');
        console.error('Registration error:', error);
    });
}

// Page-Specific Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the index page
    if (document.getElementById('hackathonList')) {
        utils.showLoading('hackathonList');
        
        apiService.fetchHackathons()
            .then(hackathons => {
                uiRenderer.renderHackathonList(hackathons);
                setupSearch(hackathons);
            })
            .catch(error => {
                utils.showError('hackathonList', 'Failed to load hackathons. Please check your internet connection and try again.');
            });
    }
    
    // Check if we're on the hackathon detail page
    else if (document.getElementById('hackathonTitle')) {
        const hackathonSlug = utils.getUrlParameter('slug');
        
        if (!hackathonSlug) {
            utils.showError('hackathonList', 'No hackathon specified. Please use the listing page to select a hackathon.');
            return;
        }

        utils.showLoading('hackathonList');
        
        apiService.fetchHackathons()
            .then(hackathons => {
                const hackathon = apiService.findHackathonBySlug(hackathons, hackathonSlug);
                uiRenderer.renderHackathonDetail(hackathon);
            })
            .catch(error => {
                utils.showError('hackathonList', 'Failed to load hackathon details. Please try again later.');
            });
    }
});