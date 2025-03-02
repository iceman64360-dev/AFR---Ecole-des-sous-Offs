/**
 * AFR Documentation - Global JavaScript
 * Alliance Francophone Reforger
 */

document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Ajuster la marge du contenu
            if (sidebar.classList.contains('collapsed')) {
                content.style.marginLeft = 'var(--sidebar-width-collapsed)';
            } else {
                content.style.marginLeft = 'var(--sidebar-width)';
            }
        });
    }
    
    // Toggle submenus
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            
            // Fermer les autres sous-menus ouverts
            if (!parent.classList.contains('open')) {
                document.querySelectorAll('.has-submenu.open').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('open');
                    }
                });
            }
            
            // Toggle open class
            parent.classList.toggle('open');
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchQuery = this.value.toLowerCase();
            
            // Rechercher seulement si la requête contient au moins 2 caractères
            if (searchQuery.length < 2) {
                const existingResults = document.querySelector('.search-results');
                if (existingResults) {
                    existingResults.remove();
                }
                return;
            }
            
            // Créer ou vider le conteneur de résultats
            let searchResults = document.querySelector('.search-results');
            
            if (!searchResults) {
                searchResults = document.createElement('div');
                searchResults.className = 'search-results';
                document.querySelector('.sidebar-search').insertAdjacentElement('afterend', searchResults);
            } else {
                searchResults.innerHTML = '';
            }
            
            // Rechercher dans les éléments de menu
            let resultCount = 0;
            
            document.querySelectorAll('.sidebar-menu a:not(.submenu-toggle)').forEach(link => {
                const linkText = link.textContent.toLowerCase();
                
                if (linkText.includes(searchQuery)) {
                    resultCount++;
                    
                    const resultItem = document.createElement('a');
                    resultItem.href = link.href;
                    resultItem.className = 'search-result-item';
                    resultItem.textContent = link.textContent.trim();
                    
                    searchResults.appendChild(resultItem);
                }
            });
            
            // Afficher un message si aucun résultat n'est trouvé
            if (resultCount === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = 'Aucun résultat trouvé';
                
                searchResults.appendChild(noResults);
            }
        });
        
        // Fermer les résultats de recherche lors d'un clic à l'extérieur
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.sidebar-search') && !e.target.closest('.search-results')) {
                const searchResults = document.querySelector('.search-results');
                if (searchResults) {
                    searchResults.remove();
                }
            }
        });
    }
    
    // Active link highlight
    highlightActiveLink();
    
    // Mobile detection and adjustments
    checkMobileView();
    
    // Window resize handling
    window.addEventListener('resize', function() {
        checkMobileView();
    });
    
    // Initialize page-specific functions
    initPageSpecificFunctions();
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    initBackToTopButton();
});

/**
 * Highlight the active link in the sidebar based on current page
 */
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.sidebar-menu a:not(.submenu-toggle)').forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (linkPath && (
            currentPath.endsWith(linkPath) || 
            (linkPath !== 'index.html' && currentPath.includes(linkPath))
        )) {
            // Add active class to the link's parent li
            link.parentElement.classList.add('active');
            
            // If in submenu, open the parent menu
            const parentMenu = link.closest('.submenu');
            if (parentMenu) {
                const parentItem = parentMenu.parentElement;
                parentItem.classList.add('open');
            }
        }
    });
    
    // If no link is active and we're on the home page, highlight home
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        const homeLink = document.querySelector('.sidebar-menu li:first-child');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

/**
 * Check if the view is mobile and adjust sidebar accordingly
 */
function checkMobileView() {
    const isMobile = window.innerWidth < 992;
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (isMobile) {
        sidebar.classList.add('collapsed');
        content.style.marginLeft = 'var(--sidebar-width-collapsed)';
    } else if (window.innerWidth >= 992 && sidebar.classList.contains('collapsed')) {
        // On desktop, remove collapsed state if it was added by mobile view
        if (!localStorage.getItem('sidebarCollapsed')) {
            sidebar.classList.remove('collapsed');
            content.style.marginLeft = 'var(--sidebar-width)';
        }
    }
}

/**
 * Initialize the back to top button functionality
 */
function initBackToTopButton() {
    // Create back to top button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.title = 'Retour en haut';
        backToTopBtn.style.display = 'none';
        
        document.body.appendChild(backToTopBtn);
        
        // Add click event
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        const backToTopBtn = document.querySelector('.back-to-top');
        
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
}

/**
 * Initialize page-specific functionality
 */
function initPageSpecificFunctions() {
    const currentPath = window.location.pathname;
    
    // METT-T Tool page
    if (currentPath.includes('mett-t.html')) {
        initMETTTool();
    }
    
    // Communications Guide page
    if (currentPath.includes('communication.html')) {
        initCommunicationsGuide();
    }
    
    // Team Leader page
    if (currentPath.includes('team-leader.html')) {
        initTeamLeaderGuide();
    }
}

/**
 * Initialize the METT-T tool functionality
 */
function initMETTTool() {
    const mettForm = document.getElementById('mett-form');
    
    if (!mettForm) return;
    
    // Save form data to localStorage
    const saveButton = document.getElementById('save-mett');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            const formData = {
                mission: document.getElementById('mission-type').value,
                enemy: document.getElementById('enemy-info').value,
                terrain: document.getElementById('terrain-info').value,
                time: document.getElementById('time-info').value,
                troops: document.getElementById('troops-info').value,
                notes: document.getElementById('additional-notes').value
            };
            
            localStorage.setItem('mett-data', JSON.stringify(formData));
            showNotification('Analyse METT-T sauvegardée avec succès!', 'success');
        });
    }
    
    // Load saved data if available
    const savedData = localStorage.getItem('mett-data');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            
            if (document.getElementById('mission-type')) document.getElementById('mission-type').value = formData.mission || '';
            if (document.getElementById('enemy-info')) document.getElementById('enemy-info').value = formData.enemy || '';
            if (document.getElementById('terrain-info')) document.getElementById('terrain-info').value = formData.terrain || '';
            if (document.getElementById('time-info')) document.getElementById('time-info').value = formData.time || '';
            if (document.getElementById('troops-info')) document.getElementById('troops-info').value = formData.troops || '';
            if (document.getElementById('additional-notes')) document.getElementById('additional-notes').value = formData.notes || '';
        } catch (e) {
            console.error('Erreur lors du chargement des données METT-T:', e);
        }
    }
    
    // Reset form button
    const resetButton = document.getElementById('reset-mett');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire?')) {
                mettForm.reset();
                localStorage.removeItem('mett-data');
                showNotification('Formulaire réinitialisé', 'info');
            }
        });
    }
}

/**
 * Initialize the Communications Guide functionality
 */
function initCommunicationsGuide() {
    // Platform selector tabs
    const platformButtons = document.querySelectorAll('.platform-btn');
    
    if (platformButtons.length) {
        platformButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                
                // Update active button
                platformButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update visible content
                document.querySelectorAll('.platform-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.querySelectorAll(`.platform-content[data-platform="${platform}"]`).forEach(content => {
                    content.classList.add('active');
                });
            });
        });
    }
}

/**
 * Initialize the Team Leader Guide functionality
 */
function initTeamLeaderGuide() {
    // Formation diagrams
    const formationSelector = document.getElementById('formation-selector');
    
    if (formationSelector) {
        formationSelector.addEventListener('change', function() {
            const selectedFormation = this.value;
            
            // Hide all diagrams
            document.querySelectorAll('.formation-diagram').forEach(diagram => {
                diagram.style.display = 'none';
            });
            
            // Show selected diagram
            const selectedDiagram = document.getElementById(`${selectedFormation}-diagram`);
            if (selectedDiagram) {
                selectedDiagram.style.display = 'block';
            }
            
            // Update description
            const descriptionElement = document.getElementById('formation-description');
            if (descriptionElement && selectedDiagram) {
                descriptionElement.textContent = selectedDiagram.getAttribute('data-description') || '';
            }
        });
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, info, warning, error)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Append to document
    document.body.appendChild(notification);
    
    // Add show class after a brief delay (for animation)
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}