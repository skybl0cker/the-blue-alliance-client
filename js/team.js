/**
 * Team page JavaScript
 * Handles loading and displaying team data
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get team number from URL parameter
    const params = new URLSearchParams(window.location.search);
    const teamNumber = params.get('team');
    
    if (!teamNumber) {
      // No team specified, redirect to teams page
      window.location.href = 'teams.html';
      return;
    }
    
    // Initialize the year selector and navigation
    initializeYearSelector();
    initializeTabNavigation();
    initializeBackButton();
    initializeFavoriteButton(teamNumber);
    
    // Load team data
    loadTeamData(teamNumber);
  });
  
  /**
   * Initialize the year selector dropdown
   */
  function initializeYearSelector() {
    const yearSelector = document.getElementById('year-selector');
    const yearDropdown = document.getElementById('year-dropdown');
    const selectedYear = document.getElementById('selected-year');
    
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Generate year options (current year down to 1992 - first FRC year)
    const yearOptions = [];
    for (let year = currentYear; year >= 1992; year--) {
      yearOptions.push(year);
    }
    
    // Create the dropdown items
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'py-1';
    
    yearOptions.forEach(year => {
      const option = document.createElement('button');
      option.className = 'block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left';
      option.textContent = year;
      
      option.addEventListener('click', () => {
        selectedYear.textContent = year;
        yearDropdown.classList.add('hidden');
        
        // Update UI elements with the new year
        document.getElementById('events-year-title').textContent = year;
        document.getElementById('robot-year-title').textContent = year;
        document.getElementById('performance-year-title').textContent = year;
        
        // Reload data for the selected year
        const teamNumber = new URLSearchParams(window.location.search).get('team');
        loadTeamEvents(teamNumber, year);
        loadTeamPerformance(teamNumber, year);
      });
      
      dropdownContainer.appendChild(option);
    });
    
    yearDropdown.innerHTML = '';
    yearDropdown.appendChild(dropdownContainer);
    
    // Toggle the dropdown
    yearSelector.addEventListener('click', () => {
      yearDropdown.classList.toggle('hidden');
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!yearSelector.contains(event.target) && !yearDropdown.contains(event.target)) {
        yearDropdown.classList.add('hidden');
      }
    });
  }
  
  /**
   * Initialize tab navigation
   */
  function initializeTabNavigation() {
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Update active tab button
        tabButtons.forEach(btn => {
          if (btn === button) {
            btn.classList.remove('tab-inactive');
            btn.classList.add('tab-active');
          } else {
            btn.classList.remove('tab-active');
            btn.classList.add('tab-inactive');
          }
        });
        
        // Show selected tab pane
        tabPanes.forEach(pane => {
          if (pane.id === `${tabName}-tab`) {
            pane.classList.remove('hidden');
          } else {
            pane.classList.add('hidden');
          }
        });
      });
    });
  }
  
  /**
   * Initialize the back button
   */
  function initializeBackButton() {
    const backButton = document.getElementById('back-button');
    
    backButton.addEventListener('click', () => {
      // Go back to previous page
      window.history.back();
    });
  }
  
  /**
   * Initialize the favorite button
   * @param {string} teamNumber - Team number
   */
  function initializeFavoriteButton(teamNumber) {
    const favoriteButton = document.getElementById('favorite-button');
    const favoriteIcon = favoriteButton.querySelector('i');
    
    // Check if team is already in favorites
    const favorites = JSON.parse(localStorage.getItem('favoriteTeams')) || [];
    const isFavorite = favorites.some(team => team.number == teamNumber);
    
    // Update icon to reflect favorite status
    if (isFavorite) {
      favoriteIcon.setAttribute('fill', 'currentColor');
    }
    
    // Toggle favorite status on click
    favoriteButton.addEventListener('click', () => {
      const favorites = JSON.parse(localStorage.getItem('favoriteTeams')) || [];
      const teamIndex = favorites.findIndex(team => team.number == teamNumber);
      
      if (teamIndex >= 0) {
        // Remove from favorites
        favorites.splice(teamIndex, 1);
        favoriteIcon.setAttribute('fill', 'none');
      } else {
        // Add to favorites
        const teamName = document.getElementById('team-name').textContent;
        favorites.push({ number: teamNumber, name: teamName });
        favoriteIcon.setAttribute('fill', 'currentColor');
      }
      
      // Save to local storage
      localStorage.setItem('favoriteTeams', JSON.stringify(favorites));
    });
  }
  
  /**
   * Load team data from API or simulated data
   * @param {string} teamNumber - Team number
   */
  async function loadTeamData(teamNumber) {
    try {
      // For real implementation, use:
      // const team = await tbaApi.getTeam(teamNumber);
      // For development without API key:
      const team = tbaApi.getSimulatedTeamDetail(teamNumber);
      
      // Update UI with team data
      document.title = `Team ${team.team_number} - ${team.nickname} | FRC Navigator`;
      
      // Header info
      document.getElementById('team-number-badge').textContent = team.team_number;
      document.getElementById('team-name').textContent = team.nickname;
      document.getElementById('team-location').textContent = `${team.city}, ${team.state_prov}`;
      document.getElementById('team-rookie-year').textContent = team.rookie_year || 'N/A';
      document.getElementById('team-title').textContent = `Team ${team.team_number} in ${document.getElementById('selected-year').textContent}`;
      
      // Team info
      document.getElementById('team-full-name').textContent = `Team ${team.team_number} - ${team.nickname}`;
      document.getElementById('team-organization').textContent = team.name || 'N/A';
      document.getElementById('team-location-full').textContent = `${team.city}, ${team.state_prov}${team.country && team.country !== 'USA' ? `, ${team.country}` : ''}`;
      document.getElementById('team-rookie-year-info').textContent = team.rookie_year || 'N/A';
      document.getElementById('team-motto').textContent = team.motto || 'N/A';
      
      // Website
      if (team.website) {
        const websiteElement = document.getElementById('team-website');
        websiteElement.textContent = team.website;
        websiteElement.href = team.website;
      } else {
        document.getElementById('team-website').textContent = 'N/A';
      }
      
      // Load additional data
      const selectedYear = parseInt(document.getElementById('selected-year').textContent);
      loadTeamEvents(teamNumber, selectedYear);
      loadTeamAwards(teamNumber);
      loadTeamMatches(teamNumber);
      loadTeamPerformance(teamNumber, selectedYear);
      
      // Mock data for robot (in a real implementation, this would come from an API)
      loadTeamRobot(teamNumber, selectedYear);
      
      // Re-initialize Feather icons
      feather.replace();
    } catch (error) {
      console.error('Error loading team data:', error);
      alert('Error loading team data. Please try again.');
    }
  }
  
  /**
   * Load team events for a specific year
   * @param {string} teamNumber - Team number
   * @param {number} year - Year to load events for
   */
  async function loadTeamEvents(teamNumber, year) {
    const eventsContainer = document.getElementById('team-events');
    
    try {
      // For real implementation, use:
      // const events = await tbaApi.getTeamEvents(teamNumber, year);
      // For development without API key:
      const events = [
        { 
          key: '2025casj', 
          name: 'Silicon Valley Regional',
          start_date: '2025-03-14',
          end_date: '2025-03-16',
          status: 'upcoming'
        },
        { 
          key: '2025caln', 
          name: 'Aerospace Valley Regional',
          start_date: '2025-03-22',
          end_date: '2025-03-24',
          status: 'upcoming'
        },
        { 
          key: '2025chcmp', 
          name: 'FIRST Championship - Houston',
          start_date: '2025-04-17',
          end_date: '2025-04-20',
          status: 'upcoming'
        }
      ];
      
      eventsContainer.innerHTML = '';
      
      if (events.length === 0) {
        eventsContainer.innerHTML = `
          <div class="py-10 text-center">
            <p class="text-gray-500">No events found for ${year}.</p>
          </div>
        `;
        return;
      }
      
      events.forEach(event => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const dateRange = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        
        const eventElement = document.createElement('div');
        eventElement.className = 'border-b pb-3 last:border-0';
        
        eventElement.innerHTML = `
          <h4 class="font-medium text-blue-700">
            <a href="event.html?event=${event.key}" class="hover:underline">${event.name}</a>
          </h4>
          <div class="flex items-center text-sm text-gray-600 mt-1">
            <i data-feather="clock" class="w-4 h-4 mr-1"></i>
            <span>${dateRange}</span>
          </div>
        `;
        
        eventsContainer.appendChild(eventElement);
      });
      
      // Re-initialize Feather icons
      feather.replace();
    } catch (error) {
      console.error('Error loading team events:', error);
      eventsContainer.innerHTML = `
        <div class="py-10 text-center">
          <p class="text-red-500">Error loading events. Please try again.</p>
        </div>
      `;
    }
  }
  
  /**
   * Load team awards
   * @param {string} teamNumber - Team number
   */
  async function loadTeamAwards(teamNumber) {
    const awardsContainer = document.getElementById('team-awards');
    
    try {
      // For real implementation, use:
      // const awards = await tbaApi.getTeamAwards(teamNumber);
      // For development without API key:
      const awards = [
        { year: 2024, name: 'Championship Winner', event_key: '2024chcmp' },
        { year: 2023, name: 'Championship Winner', event_key: '2023chcmp' },
        { year: 2022, name: 'Excellence in Engineering Award', event_key: '2022casj' },
        { year: 2022, name: 'Regional Winner', event_key: '2022casj' },
        { year: 2021, name: 'Innovation Challenge Winner', event_key: '2021chcmp' }
      ];
      
      // Update the award count in the header
      document.getElementById('team-awards-count').textContent = awards.length + '+';
      
      awardsContainer.innerHTML = '';
      
      if (awards.length === 0) {
        awardsContainer.innerHTML = `
          <div class="py-10 text-center">
            <p class="text-gray-500">No awards found.</p>
          </div>
        `;
        return;
      }
      
      // Get event names (in a real implementation, this would come from the API)
      const eventNames = {
        '2024chcmp': 'FIRST Championship',
        '2023chcmp': 'FIRST Championship',
        '2022casj': 'Silicon Valley Regional',
        '2021chcmp': 'FIRST Championship'
      };
      
      // Display only the first 4 awards
      const displayAwards = awards.slice(0, 4);
      
      displayAwards.forEach(award => {
        const awardElement = document.createElement('div');
        awardElement.className = 'border-b pb-3 last:border-0';
        
        awardElement.innerHTML = `
          <div class="flex items-start">
            <div class="bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-medium mr-3">
              ${award.year}
            </div>
            <div>
              <div class="font-medium">${award.name}</div>
              <div class="text-sm text-gray-500">${eventNames[award.event_key] || 'Event'}</div>
            </div>
          </div>
        `;
        
        awardsContainer.appendChild(awardElement);
      });
      
      // Add a "View All" button if there are more awards
      if (awards.length > 4) {
        const viewAllButton = document.createElement('button');
        viewAllButton.className = 'w-full py-2 text-blue-600 font-medium hover:bg-blue-50 rounded transition';
        viewAllButton.textContent = 'View All Awards';
        viewAllButton.addEventListener('click', () => {
          // Navigate to awards tab
          document.querySelector('[data-tab="awards"]').click();
        });
        
        awardsContainer.appendChild(viewAllButton);
      }
    } catch (error) {
      console.error('Error loading team awards:', error);
      awardsContainer.innerHTML = `
        <div class="py-10 text-center">
          <p class="text-red-500">Error loading awards. Please try again.</p>
        </div>
      `;
    }
  }
  
  /**
   * Load team matches
   * @param {string} teamNumber - Team number
   */
  async function loadTeamMatches(teamNumber) {
    const matchesContainer = document.getElementById('team-matches');
    
    try {
      // For real implementation, this would fetch matches from the API
      // For development, we'll use mock data
      const matches = [
        { 
          key: '2025casj_qm5',
          comp_level: 'qm',
          set_number: 1,
          match_number: 5,
          alliances: {
            red: { score: 89, team_keys: [`frc${teamNumber}`, 'frc1114', 'frc118'] },
            blue: { score: 75, team_keys: ['frc2056', 'frc217', 'frc1241'] }
          },
          winning_alliance: 'red'
        },
        { 
          key: '2025casj_qm12',
          comp_level: 'qm',
          set_number: 1,
          match_number: 12,
          alliances: {
            red: { score: 95, team_keys: [`frc${teamNumber}`, 'frc469', 'frc3707'] },
            blue: { score: 62, team_keys: ['frc195', 'frc5050', 'frc1323'] }
          },
          winning_alliance: 'red'
        },
        { 
          key: '2025casj_sf1m1',
          comp_level: 'sf',
          set_number: 1,
          match_number: 1,
          alliances: {
            red: { score: 92, team_keys: [`frc${teamNumber}`, 'frc1114', 'frc118'] },
            blue: { score: 88, team_keys: ['frc33', 'frc1323', 'frc2468'] }
          },
          winning_alliance: 'red'
        }
      ];
      
      matchesContainer.innerHTML = '';
      
      if (matches.length === 0) {
        matchesContainer.innerHTML = `
          <div class="py-10 text-center">
            <p class="text-gray-500">No matches found.</p>
          </div>
        `;
        return;
      }
      
      // Display only the first 3 matches
      const displayMatches = matches.slice(0, 3);
      
      displayMatches.forEach(match => {
        const matchName = formatMatchName(match);
        const isWinner = (match.winning_alliance === 'red' && match.alliances.red.team_keys.includes(`frc${teamNumber}`)) || 
                        (match.winning_alliance === 'blue' && match.alliances.blue.team_keys.includes(`frc${teamNumber}`));
        
        const matchElement = document.createElement('div');
        matchElement.className = 'flex items-center border-b pb-2 last:border-0';
        
        matchElement.innerHTML = `
          <div class="w-16 text-sm font-medium">${matchName}</div>
          <div class="w-12 h-8 flex items-center justify-center rounded text-white text-sm font-bold ${isWinner ? 'bg-green-500' : 'bg-red-500'}">
            ${isWinner ? 'W' : 'L'}
          </div>
          <div class="ml-2">
            <div class="text-xs text-gray-500">Score</div>
            <div class="font-medium">
              ${match.alliances.red.score} - ${match.alliances.blue.score}
            </div>
          </div>
        `;
        
        matchesContainer.appendChild(matchElement);
      });
      
      // Add a "View All" button if there are more matches
      if (matches.length > 3) {
        const viewAllButton = document.createElement('button');
        viewAllButton.className = 'w-full py-2 text-blue-600 font-medium hover:bg-blue-50 rounded transition';
        viewAllButton.textContent = 'View All Matches';
        viewAllButton.addEventListener('click', () => {
          // Navigate to matches tab
          document.querySelector('[data-tab="matches"]').click();
        });
        
        matchesContainer.appendChild(viewAllButton);
      }
    } catch (error) {
      console.error('Error loading team matches:', error);
      matchesContainer.innerHTML = `
        <div class="py-10 text-center">
          <p class="text-red-500">Error loading matches. Please try again.</p>
        </div>
      `;
    }
  }
  
  /**
   * Load team performance data and create chart
   * @param {string} teamNumber - Team number
   * @param {number} year - Year to load data for
   */
  function loadTeamPerformance(teamNumber, year) {
    try {
      // For real implementation, this would come from the API
      // For development, we'll use mock data
      const performanceData = [
        { event: 'Week 1', opr: 87.2, dpr: 38.5, ccwm: 48.7 },
        { event: 'Week 3', opr: 92.4, dpr: 30.2, ccwm: 62.2 },
        { event: 'Week 5', opr: 98.1, dpr: 25.6, ccwm: 72.5 },
        { event: 'Champs', opr: 99.5, dpr: 22.3, ccwm: 77.2 }
      ];
      
      // Get the chart canvas
      const chartCanvas = document.getElementById('performance-chart');
      
      // Destroy existing chart if it exists
      if (window.performanceChart) {
        window.performanceChart.destroy();
      }
      
      // Create the chart
      window.performanceChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
          labels: performanceData.map(item => item.event),
          datasets: [
            {
              label: 'OPR',
              data: performanceData.map(item => item.opr),
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              tension: 0.4,
              borderWidth: 2
            },
            {
              label: 'DPR',
              data: performanceData.map(item => item.dpr),
              borderColor: '#DC2626',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              tension: 0.4,
              borderWidth: 2
            },
            {
              label: 'CCWM',
              data: performanceData.map(item => item.ccwm),
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    } catch (error) {
      console.error('Error loading team performance data:', error);
      
      const chartContainer = document.getElementById('performance-chart').parentElement;
      chartContainer.innerHTML = `
        <div class="py-10 text-center">
          <p class="text-red-500">Error loading performance data. Please try again.</p>
        </div>
      `;
    }
  }
  
  /**
   * Load team robot information
   * @param {string} teamNumber - Team number
   * @param {number} year - Year to load data for
   */
  function loadTeamRobot(teamNumber, year) {
    // For real implementation, this would come from the API
    // For development, we'll use mock data based on team number
    const robots = {
      254: [
        { year: 2024, name: 'Quasar', gamepiece: 'Note', description: 'Shooter and climber robot' },
        { year: 2023, name: 'Astro', gamepiece: 'Cube and Cone', description: 'Hybrid arm manipulator' },
        { year: 2022, name: 'Stinger', gamepiece: 'Cargo', description: 'Floor intake shooter' }
      ],
      2056: [
        { year: 2024, name: 'Challenger', gamepiece: 'Note', description: 'Flywheel shooter with telescoping arm' },
        { year: 2023, name: 'Tempest', gamepiece: 'Cube and Cone', description: 'Double telescoping arm' },
        { year: 2022, name: 'Vortex', gamepiece: 'Cargo', description: 'High-speed intake and shooter' }
      ]
    };
    
    // Get the robot for the selected team and year
    const teamRobots = robots[teamNumber] || robots[254];
    const robot = teamRobots.find(r => r.year === year) || teamRobots[0];
    
    // Update UI
    document.getElementById('robot-name').textContent = robot.name || 'N/A';
    document.getElementById('robot-gamepiece').textContent = robot.gamepiece || 'N/A';
    document.getElementById('robot-description').textContent = robot.description || 'N/A';
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
    
    if (compLevel === 'qm') return `Qual ${matchNumber}`;
    if (compLevel === 'ef') return `Octo ${setNumber}-${matchNumber}`;
    if (compLevel === 'qf') return `QF ${setNumber}-${matchNumber}`;
    if (compLevel === 'sf') return `SF ${setNumber}-${matchNumber}`;
    if (compLevel === 'f') return `F ${matchNumber}`;
    
    return `${compLevel}${setNumber}m${matchNumber}`;
  }