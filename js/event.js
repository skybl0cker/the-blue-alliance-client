/**
 * Event page JavaScript
 * Handles loading and displaying event data
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get event key from URL parameter
    const params = new URLSearchParams(window.location.search);
    const eventKey = params.get('event');
    
    if (!eventKey) {
      // No event specified, redirect to events page
      window.location.href = 'events.html';
      return;
    }
    
    // Initialize navigation
    initializeTabNavigation();
    initializeBackButton();
    initializeFavoriteButton(eventKey);
    
    // Load event data
    loadEventData(eventKey);
  });
  
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
    
    // Make "View Full Schedule" button switch to schedule tab
    const viewScheduleButton = document.getElementById('view-schedule-button');
    if (viewScheduleButton) {
      viewScheduleButton.addEventListener('click', () => {
        document.querySelector('[data-tab="schedule"]').click();
      });
    }
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
   * @param {string} eventKey - Event key
   */
  function initializeFavoriteButton(eventKey) {
    const favoriteButton = document.getElementById('favorite-button');
    const favoriteIcon = favoriteButton.querySelector('i');
    
    // Check if event is already in favorites
    const favoriteEvents = JSON.parse(localStorage.getItem('favoriteEvents')) || [];
    const isFavorite = favoriteEvents.includes(eventKey);
    
    // Update icon to reflect favorite status
    if (isFavorite) {
      favoriteIcon.setAttribute('fill', 'currentColor');
    }
    
    // Toggle favorite status on click
    favoriteButton.addEventListener('click', () => {
      const favoriteEvents = JSON.parse(localStorage.getItem('favoriteEvents')) || [];
      const eventIndex = favoriteEvents.indexOf(eventKey);
      
      if (eventIndex >= 0) {
        // Remove from favorites
        favoriteEvents.splice(eventIndex, 1);
        favoriteIcon.setAttribute('fill', 'none');
      } else {
        // Add to favorites
        favoriteEvents.push(eventKey);
        favoriteIcon.setAttribute('fill', 'currentColor');
      }
      
      // Save to local storage
      localStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents));
    });
  }
  
  /**
   * Load event data from API or simulated data
   * @param {string} eventKey - Event key
   */
  async function loadEventData(eventKey) {
    try {
      // For real implementation, use:
      // const event = await tbaApi.getEvent(eventKey);
      // For development without API key:
      const event = {
        key: eventKey,
        name: 'Silicon Valley Regional',
        location: 'San Jose State University Event Center, San Jose, CA',
        start_date: '2025-03-14',
        end_date: '2025-03-16',
        type: 'Regional',
        teams_count: 42,
        status: 'upcoming',
        city: 'San Jose',
        state_prov: 'CA',
        country: 'USA',
        website: 'https://www.firstinspires.org/team-event-search/event?id=2025casj',
        district_key: null // Regional events don't have district keys
      };
      
      // Update page title
      document.title = `${event.name} | FRC Navigator`;
      
      // Update header info
      document.getElementById('event-name').textContent = event.name;
      document.getElementById('event-date').textContent = formatDateRange(event.start_date, event.end_date);
      document.getElementById('event-location').textContent = `${event.city}, ${event.state_prov}`;
      document.getElementById('event-type').textContent = event.type || 'Event';
      document.getElementById('event-status').textContent = event.status || 'Scheduled';
      document.getElementById('event-teams-count').textContent = event.teams_count || 'N/A';
      document.getElementById('event-title').textContent = `${event.name} Overview`;
      
      // Update event info
      document.getElementById('event-dates').textContent = formatDateRange(event.start_date, event.end_date);
      document.getElementById('event-location-full').textContent = event.location || `${event.city}, ${event.state_prov}, ${event.country}`;
      document.getElementById('event-teams-info').textContent = `${event.teams_count} teams competing`;
      
      // Update event website
      if (event.website) {
        const websiteElement = document.getElementById('event-website');
        websiteElement.textContent = event.website;
        websiteElement.href = event.website;
      } else {
        document.getElementById('event-website').textContent = 'N/A';
      }
      
      // Show district info if available
      if (event.district_key) {
        document.getElementById('event-district-container').classList.remove('hidden');
        document.getElementById('event-district').textContent = formatDistrictName(event.district_key);
      }
      
      // Load additional data
      loadEventTeamDistribution(eventKey);
      loadKeyTeams(eventKey);
      loadEventSchedule(eventKey);
      loadEventAwards(eventKey);
      
      // Re-initialize Feather icons
      feather.replace();
    } catch (error) {
      console.error('Error loading event data:', error);
      alert('Error loading event data. Please try again.');
    }
  }
  
  /**
   * Load event team distribution data and create chart
   * @param {string} eventKey - Event key
   */
  function loadEventTeamDistribution(eventKey) {
    try {
      // For real implementation, this would come from the API
      // For development, we'll use mock data
      const distribution = [
        { name: 'Veteran Teams (5+ years)', value: 28 },
        { name: 'Experienced Teams (2-4 years)', value: 10 },
        { name: 'Rookie Teams (1st year)', value: 4 }
      ];
      
      // Get the chart canvas
      const chartCanvas = document.getElementById('teams-chart');
      
      // Destroy existing chart if it exists
      if (window.teamsChart) {
        window.teamsChart.destroy();
      }
      
      // Create the chart
      window.teamsChart = new Chart(chartCanvas, {
        type: 'doughnut',
        data: {
          labels: distribution.map(item => item.name),
          datasets: [{
            data: distribution.map(item => item.value),
            backgroundColor: ['#1d4ed8', '#3b82f6', '#93c5fd'],
            borderColor: ['#ffffff', '#ffffff', '#ffffff'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          cutout: '60%'
        }
      });
    } catch (error) {
      console.error('Error loading team distribution data:', error);
      
      const chartContainer = document.getElementById('teams-chart').parentElement;
      chartContainer.innerHTML = `
        <div class="py-10 text-center">
          <p class="text-red-500">Error loading team distribution data. Please try again.</p>
        </div>
      `;
    }
  }
  
  /**
   * Load key teams for the event
   * @param {string} eventKey - Event key
   */
  async function loadKeyTeams(eventKey) {
    const keyTeamsContainer = document.getElementById('key-teams');
    
    try {
      // For real implementation, use:
      // const teams = await tbaApi.getEventTeams(eventKey);
      // Sort by rank or team number and get top teams
      // For development without API key:
      const keyTeams = [
        { team_number: 254, nickname: 'The Cheesy Poofs', city: 'San Jose', state_prov: 'CA' },
        { team_number: 1114, nickname: 'Simbotics', city: 'St. Catharines', state_prov: 'ON', country: 'Canada' },
        { team_number: 118, nickname: 'Robonauts', city: 'League City', state_prov: 'TX' },
        { team_number: 2056, nickname: 'OP Robotics', city: 'Stoney Creek', state_prov: 'ON', country: 'Canada' },
        { team_number: 217, nickname: 'ThunderChickens', city: 'Sterling Heights', state_prov: 'MI' }
      ];
      
      keyTeamsContainer.innerHTML = '';
      
      if (keyTeams.length === 0) {
        keyTeamsContainer.innerHTML = `
          <div class="py-10 text-center">
            <p class="text-gray-500">No teams found for this event.</p>
          </div>
        `;
        return;
      }
      
      keyTeams.forEach(team => {
        const teamElement = document.createElement('a');
        teamElement.href = `team.html?team=${team.team_number}`;
        teamElement.className = 'flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition hover-scale';
        
        const location = `${team.city}, ${team.state_prov}${team.country && team.country !== 'USA' ? `, ${team.country}` : ''}`;
        
        teamElement.innerHTML = `
          <div class="w-10 h-10 bg-blue-100 text-blue-800 rounded flex items-center justify-center font-semibold mr-3">
            ${team.team_number}
          </div>
          <div>
            <h4 class="font-medium">${team.nickname}</h4>
            <p class="text-sm text-gray-600">${location}</p>
          </div>
        `;
        
        keyTeamsContainer.appendChild(teamElement);
      });
      
      // Re-initialize Feather icons
      feather.replace();
    } catch (error) {
      console.error('Error loading key teams:', error);
      keyTeamsContainer.innerHTML = `
        <div class="py-10 text-center">
          <p class="text-red-500">Error loading teams. Please try again.</p>
        </div>
      `;
    }
  }
  
  /**
   * Load event schedule
   * @param {string} eventKey - Event key
   */
  async function loadEventSchedule(eventKey) {
    const scheduleContainer = document.getElementById('event-schedule');
    
    try {
      // For real implementation, this would come from the API
      // For development, we'll use mock data
      const schedule = [
        { 
          day: 'Friday, March 14', 
          events: [
            { time: '8:00 AM - 11:00 AM', name: 'Team Load-In & Pit Setup' },
            { time: '11:00 AM - 12:00 PM', name: 'Lunch Break' },
            { time: '12:00 PM - 6:30 PM', name: 'Qualification Matches' }
          ]
        },
        { 
          day: 'Saturday, March 15', 
          events: [
            { time: '8:30 AM - 12:30 PM', name: 'Qualification Matches' },
            { time: '12:30 PM - 1:30 PM', name: 'Lunch Break' },
            { time: '1:30 PM - 6:00 PM', name: 'Qualification Matches' }
          ]
        },
        { 
          day: 'Sunday, March 16', 
          events: [
            { time: '9:00 AM - 10:00 AM', name: 'Alliance Selection' },
            { time: '10:30 AM - 12:30 PM', name: 'Playoff Matches' },
            { time: '12:30 PM - 1:30 PM', name: 'Lunch Break' },
            { time: '1:30 PM - 4:30 PM', name: 'Playoff Matches & Awards Ceremony' }
          ]
        }
      ];
      
      scheduleContainer.innerHTML = '';
      
      if (schedule.length === 0) {
        scheduleContainer.innerHTML = `
          <div class="py-10 text-center">
            <p class="text-gray-500">No schedule information available.</p>
          </div>
        `;
        return;
      }
      
      schedule.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'mb-6 last:mb-0';
        
        dayElement.innerHTML = `
          <h4 class="font-semibold text-blue-800 mb-2">${day.day}</h4>
          <div class="space-y-2">
            ${day.events.map(event => `
              <div class="flex border-l-4 border-blue-600 pl-4 py-1">
                <div class="w-40 text-sm font-medium text-gray-500">${event.time}</div>
                <div class="flex-1">${event.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        
        scheduleContainer.appendChild(dayElement);
      });
    } catch (error) {
      console.error('Error loading event schedule:', error);
      scheduleContainer.innerHTML = `
        <div class="py-10 text-center">
          <p class="text-red-500">Error loading schedule. Please try again.</p>
        </div>
      `;
    }
  }
  
  /**
   * Load event awards
   * @param {string} eventKey - Event key
   */
  async function loadEventAwards(eventKey) {
    const awardsContainer = document.getElementById('event-awards');
    
    try {
      // For real implementation, this would come from the API
      // For development, we'll use mock data
      const awards = [
        'Regional Winner',
        'Regional Finalist',
        'Excellence in Engineering Award',
        'Industrial Design Award',
        'Innovation in Control Award',
        'Quality Award',
        'Creativity Award',
        'Entrepreneurship Award',
        'Gracious Professionalism Award',
        'Team Spirit Award',
        'Imagery Award',
        'Safety Award',
        'Rookie All-Star Award',
        'Rookie Inspiration Award',
        'Woodie Flowers Finalist Award',
        'FIRST Dean\'s List Finalist Award'
      ];
      
      awardsContainer.innerHTML = '';
      
      if (awards.length === 0) {
        awardsContainer.innerHTML = `
          <div class="py-10 text-center">
            <p class="text-gray-500">No awards information available.</p>
          </div>
        `;
        return;
      }
      
      awards.forEach(award => {
        const awardElement = document.createElement('div');
        awardElement.className = 'py-1.5 px-3 bg-blue-50 text-blue-800 rounded-md mb-2 hover:bg-blue-100 transition';
        awardElement.textContent = award;
        
        awardsContainer.appendChild(awardElement);
      });
    } catch (error) {
      console.error('Error loading event awards:', error);
      awardsContainer.innerHTML = `
        <div class="py-10 text-center">
          <p class="text-red-500">Error loading awards. Please try again.</p>
        </div>
      `;
    }
  }
  
  /**
   * Format a date range from start and end dates
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {string} - Formatted date range
   */
  function formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return 'Date TBD';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Format as "Mar 14-16, 2025"
    return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`;
  }
  
  /**
   * Format a district name from district key
   * @param {string} districtKey - District key (e.g. 2025fim)
   * @returns {string} - Formatted district name
   */
  function formatDistrictName(districtKey) {
    if (!districtKey) return 'N/A';
    
    const districts = {
      'fim': 'Michigan',
      'fma': 'Mid-Atlantic',
      'fnc': 'North Carolina',
      'in': 'Indiana',
      'isr': 'Israel',
      'ne': 'New England',
      'ont': 'Ontario',
      'pnw': 'Pacific Northwest',
      'pch': 'Peachtree',
      'tx': 'Texas'
    };
    
    // Extract code from district key (format: YYYYcode)
    const code = districtKey.substring(4);
    
    return districts[code] || code.toUpperCase();
  }