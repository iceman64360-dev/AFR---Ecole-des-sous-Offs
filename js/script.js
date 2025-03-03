document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des éléments de l'interface
    initializeToggleContent();
    initializeSearchFunction();
    initializeActiveNavLinks();
    initializeSmoothScrolling();
    initializeBackToTop();
    initializeHeaderCompact();
    
    // Afficher le message de bienvenue pour les nouveaux visiteurs
    showWelcomeMessage();
});

// Gestion de l'affichage/masquage des sections de contenu
function initializeToggleContent() {
    const toggleButtons = document.querySelectorAll('.toggle-content');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = button.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            const buttonIcon = button.querySelector('i');
            
            if (targetSection.style.display === 'none') {
                // Animation d'ouverture
                targetSection.style.display = 'block';
                targetSection.style.opacity = '0';
                targetSection.style.maxHeight = '0';
                
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.maxHeight = '1000px';
                }, 10);
                
                // Modifier l'icône et le texte du bouton
                if (buttonIcon) {
                    buttonIcon.className = 'fas fa-chevron-up';
                }
                button.textContent = button.textContent.replace('VOIR', 'MASQUER');
                button.appendChild(buttonIcon);
            } else {
                // Animation de fermeture
                targetSection.style.opacity = '0';
                targetSection.style.maxHeight = '0';
                
                setTimeout(() => {
                    targetSection.style.display = 'none';
                }, 300);
                
                // Modifier l'icône et le texte du bouton
                if (buttonIcon) {
                    buttonIcon.className = 'fas fa-chevron-down';
                }
                button.textContent = button.textContent.replace('MASQUER', 'VOIR');
                button.appendChild(buttonIcon);
            }
        });
    });
}

// Fonction de recherche
function initializeSearchFunction() {
    const searchInput = document.querySelector('.military-search');
    const searchButton = document.querySelector('.search-button');
    const searchResults = document.getElementById('search-results');
    const recentSearchesList = document.getElementById('recent-searches-list');
    const searchTags = document.querySelectorAll('.military-tag');
    
    if (!searchInput) return;
    
    // Charger les recherches récentes depuis localStorage
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    updateRecentSearchesList();
    
    // Base de données de recherche (serait remplacée par une vraie recherche côté serveur)
    const searchDatabase = [
        { title: 'Formation Caporal', url: 'docs/caporal.html', category: 'formation', tags: ['formation', 'caporal', 'base'] },
        { title: 'Formation Sergent', url: 'docs/sergent.html', category: 'formation', tags: ['formation', 'sergent'] },
        { title: 'Formation Adjudant', url: 'docs/adjudant.html', category: 'formation', tags: ['formation', 'adjudant'] },
        { title: 'Formation Adjudant-Chef', url: 'docs/adjudant-chef.html', category: 'formation', tags: ['formation', 'adjudant-chef'] },
        { title: 'Formation Major', url: 'docs/major.html', category: 'formation', tags: ['formation', 'major'] },
        { title: 'Formation Aspirant', url: 'docs/aspirant.html', category: 'formation', tags: ['formation', 'aspirant', 'officier'] },
        { title: 'Formation Lieutenant', url: 'docs/lieutenant.html', category: 'formation', tags: ['formation', 'lieutenant', 'officier'] },
        { title: 'Formation Capitaine', url: 'docs/capitaine.html', category: 'formation', tags: ['formation', 'capitaine', 'officier'] },
        { title: 'Formation Commandant', url: 'docs/commandant.html', category: 'formation', tags: ['formation', 'commandant', 'officier'] },
        { title: 'Formation Lieutenant-Colonel', url: 'docs/lieutenant-colonel.html', category: 'formation', tags: ['formation', 'lieutenant-colonel', 'officier'] },
        { title: 'Formation Colonel', url: 'docs/colonel.html', category: 'formation', tags: ['formation', 'colonel', 'officier'] },
        { title: 'Tactique', url: 'docs/tactique.html', category: 'documentation', tags: ['tactique', 'stratégie'] },
        { title: 'Communication', url: 'docs/communication.html', category: 'documentation', tags: ['communication', 'radio'] },
        { title: 'Leadership', url: 'docs/leadership.html', category: 'documentation', tags: ['leadership', 'commandement'] },
        { title: 'Mouvements en formation', url: 'docs/mouvements.html', category: 'documentation', tags: ['mouvement', 'formation', 'tactique'] },
        { title: 'Prise et défense d\'objectifs', url: 'docs/combat.html', category: 'documentation', tags: ['objectif', 'défense', 'attaque', 'combat'] },
        { title: 'Utilisation des couverts et de la topographie', url: 'docs/couverts.html', category: 'documentation', tags: ['couvert', 'topographie', 'terrain'] },
        { title: 'Tir de suppression et manœuvres', url: 'docs/suppression.html', category: 'documentation', tags: ['tir', 'suppression', 'manoeuvre'] },
        { title: 'Tactiques d\'embuscade', url: 'docs/embuscade.html', category: 'documentation', tags: ['embuscade', 'tactique'] },
        { title: 'Utilisation des radios', url: 'docs/radio.html', category: 'documentation', tags: ['radio', 'communication'] },
        { title: 'Gestion des unités et leadership', url: 'docs/commandement.html', category: 'documentation', tags: ['commandement', 'leadership', 'gestion'] },
        { title: 'Utilisation du matériel', url: 'docs/materiel.html', category: 'documentation', tags: ['matériel', 'équipement'] },
        { title: 'Utilisation de Game Master', url: 'docs/game-master.html', category: 'documentation', tags: ['game master', 'simulation', 'entraînement'] }
    ];
    
    // Fonction de recherche avec debounce
    let debounceTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    });
    
    // Recherche au clic sur le bouton
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            performSearch();
        });
    }
    
    // Recherche au clic sur un tag
    searchTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const searchTerm = tag.getAttribute('data-search');
            searchInput.value = searchTerm;
            performSearch();
        });
    });
    
    // Fonction principale de recherche
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        // Filtrer les résultats par titre et tags
        const results = searchDatabase.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.tags.some(tag => tag.includes(query))
        );
        
        displaySearchResults(results, query);
        
        // Ajouter à l'historique des recherches si des résultats sont trouvés
        if (results.length > 0 && query.length > 2) {
            addToRecentSearches(query);
        }
    }
    
    // Afficher les résultats de recherche
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p><i class="fas fa-exclamation-triangle"></i> Aucun résultat trouvé pour "<strong>${query}</strong>"</p>
                    <p>Essayez avec d'autres termes ou consultez les catégories.</p>
                </div>
            `;
            return;
        }
        
        // Grouper les résultats par catégorie
        const groupedResults = {};
        results.forEach(item => {
            if (!groupedResults[item.category]) {
                groupedResults[item.category] = [];
            }
            groupedResults[item.category].push(item);
        });
        
        // Construire l'HTML des résultats
        let resultsHTML = `
            <div class="results-header">
                <i class="fas fa-search"></i> ${results.length} résultat(s) trouvé(s) pour "<strong>${query}</strong>"
            </div>
        `;
        
        // Afficher par catégorie
        for (const category in groupedResults) {
            const categoryTitle = category === 'formation' ? 'Plans de Formation' : 'Documentation';
            const categoryIcon = category === 'formation' ? 'fas fa-graduation-cap' : 'fas fa-book';
            
            resultsHTML += `
                <div class="result-category">
                    <h3><i class="${categoryIcon}"></i> ${categoryTitle}</h3>
                    <ul class="military-list">
            `;
            
            groupedResults[category].forEach(item => {
                const itemIcon = getIconForItem(item);
                resultsHTML += `
                    <li>
                        <a href="${item.url}">
                            <i class="${itemIcon}"></i>
                            ${highlightMatch(item.title, query)}
                        </a>
                    </li>
                `;
            });
            
            resultsHTML += `</ul></div>`;
        }
        
        searchResults.innerHTML = resultsHTML;
        
        // Faire défiler jusqu'aux résultats
        searchResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Obtenir l'icône appropriée pour l'élément
    function getIconForItem(item) {
        if (item.title.includes('Formation')) {
            return 'fas fa-user-graduate';
        } else if (item.title.includes('Tactique') || item.title.includes('tactique')) {
            return 'fas fa-chess';
        } else if (item.title.includes('Communication') || item.title.includes('radio')) {
            return 'fas fa-comments';
        } else if (item.title.includes('Leadership')) {
            return 'fas fa-users';
        } else if (item.title.includes('Game Master')) {
            return 'fas fa-gamepad';
        } else if (item.title.includes('matériel')) {
            return 'fas fa-tools';
        }
        return 'fas fa-file-alt';
    }
    
    // Mettre en surbrillance la partie correspondante
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Gestion des recherches récentes
    function addToRecentSearches(query) {
        // Éviter les doublons et limiter à 5 recherches
        recentSearches = recentSearches.filter(item => item.toLowerCase() !== query.toLowerCase());
        recentSearches.unshift(query);
        if (recentSearches.length > 5) {
            recentSearches.pop();
        }
        
        // Sauvegarder dans localStorage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        
        // Mettre à jour l'affichage
        updateRecentSearchesList();
    }
    
    // Mettre à jour la liste des recherches récentes
    function updateRecentSearchesList() {
        if (!recentSearchesList) return;
        
        if (recentSearches.length === 0) {
            recentSearchesList.innerHTML = '<li class="no-recent">Aucune recherche récente</li>';
            return;
        }
        
        recentSearchesList.innerHTML = '';
        recentSearches.forEach(term => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" class="recent-search-item">
                    <i class="fas fa-history"></i> ${term}
                </a>
            `;
            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                searchInput.value = term;
                performSearch();
            });
            recentSearchesList.appendChild(li);
        });
    }
}

// Gestion des liens de navigation actifs
function initializeActiveNavLinks() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Détecter la section active au défilement
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href.includes('#') && href !== '#' && href.substring(href.indexOf('#')) === `#${current}`) {
                link.classList.add('active');
            } else if (href === 'index.html' && current === 'apercu') {
                link.classList.add('active');
            }
        });
    });
}

// Navigation fluide
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignorer les liens "#"
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.getElementById('site-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Bouton retour en haut
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    // Afficher/masquer le bouton en fonction du défilement
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Action au clic
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// En-tête compact au défilement
function initializeHeaderCompact() {
    const header = document.getElementById('site-header');
    const logoContainer = header.querySelector('.logo-container');
    const logoImg = logoContainer.querySelector('img');
    const headerTitle = header.querySelector('h1');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('compact');
            logoImg.style.width = '40px';
            headerTitle.style.fontSize = '1.2rem';
        } else {
            header.classList.remove('compact');
            logoImg.style.width = '';
            headerTitle.style.fontSize = '';
        }
    });
}

// Message de bienvenue
function showWelcomeMessage() {
    // Vérifier si c'est la première visite dans cette session
    if (!sessionStorage.getItem('welcomed')) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-header">
                    <h3><i class="fas fa-medal"></i> BIENVENUE SUR LA PLATEFORME DE DOCUMENTATION</h3>
                    <button id="welcome-close" aria-label="Fermer">×</button>
                </div>
                <div class="welcome-body">
                    <p>Vous trouverez ici toutes les ressources nécessaires pour la formation des Sous-Officiers.</p>
                    <p>Naviguez à travers les différentes sections ou utilisez la recherche pour trouver rapidement ce dont vous avez besoin.</p>
                    <p>Cette plateforme a été conçue pour faciliter l'accès aux informations essentielles à votre formation.</p>
                </div>
                <div class="welcome-footer">
                    <button id="welcome-continue" class="military-btn">COMMENCER</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(welcomeMessage);
        
        // Animation d'entrée
        setTimeout(() => {
            welcomeMessage.classList.add('show');
        }, 500);
        
        // Fermer le message
        document.getElementById('welcome-close').addEventListener('click', closeWelcome);
        document.getElementById('welcome-continue').addEventListener('click', closeWelcome);
        
        function closeWelcome() {
            welcomeMessage.classList.remove('show');
            setTimeout(() => {
                welcomeMessage.remove();
            }, 300);
        }
        
        // Marquer comme accueilli
        sessionStorage.setItem('welcomed', 'true');
    }
}