/**
 * Main JavaScript file for FRC Navigator
 * Handles navigation, data loading, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements
    initializeSidebar();
    initializeSearch();
    loadFavoriteTeams();
    
    // Load dashboard data if on index page
    if (document.getElementById('upcoming-events')) {
      loadDashboardData();
    }
    
    // Initialize Feather icons again after dynamic content is loaded
    feather.replace();
  });
  
  /**
   * Initialize sidebar functionality
   */
  function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        mobileSidebar.classList.remove('hidden');
      });
    }
    
    if (closeSidebar) {
      closeSidebar.addEventListener('click', () => {
        mobileSidebar.classList.add('hidden');
      });
    }
  }
  
  /**
   * Initialize search functionality
   */
  function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchButton = document.getElementById('mobile-search-button');
    
    const performSearch = (query) => {
      if (query && query.trim()) {
        window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
      }
    };
    
    if (searchInput && searchButton) {
      searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
      });
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch(searchInput.value);
        }
      });
    }
    
    if (mobileSearchInput && mobileSearchButton) {
      mobileSearchButton.addEventListener('click', () => {
        performSearch(mobileSearchInput.value);
      });
      
      mobileSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch(mobileSearchInput.value);
        }
      });
    }
  }
  
  /**
   * Load favorite teams from local storage and display in sidebar
   */
  function loadFavoriteTeams() {
    // In a real app, this would be user-specific data from a database
    // For now, we'll use localStorage
    const favoritesContainer = document.getElementById('favorite-teams');
    const mobileFavoritesContainer = document.getElementById('mobile-favorite-teams');
    
    // Get favorites from localStorage or use default favorites
    let favoriteTeams = JSON.parse(localStorage.getItem('favoriteTeams')) || [
      { number: 254, name: 'The Cheesy Poofs' },
      { number: 118, name: 'Robonauts' },
      { number: 2056, name: 'OP Robotics' }
    ];
    
    const renderTeams = (container, teams) => {
      if (!container) return;
      
      container.innerHTML = '';
      
      teams.forEach(team => {
        const teamElement = document.createElement('a');
        teamElement.href = `team.html?team=${team.number}`;
        teamElement.className = 'flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer';
        teamElement.innerHTML = `
          <div class="team-badge">${team.number}</div>
          <span class="text-sm">Team ${team.number}</span>
        `;
        container.appendChild(teamElement);
      });
      
      // Re-initialize icons
      feather.replace();
    };
    
    // Render teams in both desktop and mobile sidebars
    renderTeams(favoritesContainer, favoriteTeams);
    renderTeams(mobileFavoritesContainer, favoriteTeams);
  }
  
  /**
   * Format a match name from competition level, set number, and match number
   * @param {Object} match - Match object with comp_level, set_number, and match_number
   * @returns {string} - Formatted match name
   */
  function formatMatchName(match) {
    const compLevel = match.comp_level;
    const setNumber = match.set_number;
    const matchNumber = match.match_number;
    
    if (compLevel === 'qm') return `Qualification ${matchNumber}`;
    if (compLevel === 'ef') return `Octofinal ${setNumber}-${matchNumber}`;
    if (compLevel === 'qf') return `Quarterfinal ${setNumber}-${matchNumber}`;
    if (compLevel === 'sf') return `Semifinal ${setNumber}-${matchNumber}`;
    if (compLevel === 'f') return `Final ${matchNumber}`;
    
    return `${compLevel}${setNumber}m${matchNumber}`;
  }
  
  /**
   * Extract team number from team key (e.g. "frc254" -> "254")
   * @param {string} teamKey - Team key from TBA API
   * @returns {string} - Team number
   */
  function getTeamNumber(teamKey) {
    return teamKey.replace('frc', '');
  }
  
  /**
   * Load dashboard data
   */
  async function loadDashboardData() {
    const upcomingEventsContainer = document.getElementById('upcoming-events');
    const topTeamsContainer = document.getElementById('top-teams');
    const recentMatchesContainer = document.getElementById('recent-matches');
    
    // Load upcoming events
    try {
      // For real implementation, use:
      // const events = await tbaApi.getEventsForYear(new Date().getFullYear());
      // For development without API key:
      const events = tbaApi.getSimulatedUpcomingEvents();
      
          if (upcomingEventsContainer) {
            // Add logic to handle upcoming events
          }
        } catch (error) {
          console.error('Error loading upcoming events:', error);
        }
      }