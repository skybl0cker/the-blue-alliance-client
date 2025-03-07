/**
 * The Blue Alliance API client
 * Documentation: https://www.thebluealliance.com/apidocs/v3
 */

class TBAApi {
    constructor() {
      this.baseUrl = 'https://www.thebluealliance.com/api/v3';
      // You'll need to get an API key from The Blue Alliance
      // https://www.thebluealliance.com/account
      this.apiKey = 'YOUR_TBA_API_KEYXKgCGALe7EzYqZUeKKONsQ45iGHVUZYlN0F6qQzchKQrLxED5DFWrYi9pcjxIzGY'; 
    }
  
    /**
     * Make a request to the TBA API
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Promise resolving to JSON response
     */
    async fetch(endpoint) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            'X-TBA-Auth-Key': this.apiKey,
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    // TEAMS ENDPOINTS
    
    /**
     * Get basic information about a team
     * @param {number|string} teamNumber - Team number (e.g. 254)
     * @returns {Promise} - Promise resolving to team data
     */
    async getTeam(teamNumber) {
      return this.fetch(`/team/frc${teamNumber}`);
    }
    
    /**
     * Get team events for a specific year
     * @param {number|string} teamNumber - Team number
     * @param {number} year - Year (e.g. 2025)
     * @returns {Promise} - Promise resolving to team events
     */
    async getTeamEvents(teamNumber, year) {
      return this.fetch(`/team/frc${teamNumber}/events/${year}`);
    }
    
    /**
     * Get team matches for a specific event
     * @param {number|string} teamNumber - Team number
     * @param {string} eventKey - Event key (e.g. 2025casj)
     * @returns {Promise} - Promise resolving to team matches
     */
    async getTeamMatches(teamNumber, eventKey) {
      return this.fetch(`/team/frc${teamNumber}/event/${eventKey}/matches`);
    }
    
    /**
     * Get team awards
     * @param {number|string} teamNumber - Team number
     * @returns {Promise} - Promise resolving to team awards
     */
    async getTeamAwards(teamNumber) {
      return this.fetch(`/team/frc${teamNumber}/awards`);
    }
    
    // EVENTS ENDPOINTS
    
    /**
     * Get events for a specific year
     * @param {number} year - Year (e.g. 2025)
     * @returns {Promise} - Promise resolving to events
     */
    async getEventsForYear(year) {
      return this.fetch(`/events/${year}`);
    }
    
    /**
     * Get information about a specific event
     * @param {string} eventKey - Event key (e.g. 2025casj)
     * @returns {Promise} - Promise resolving to event data
     */
    async getEvent(eventKey) {
      return this.fetch(`/event/${eventKey}`);
    }
    
    /**
     * Get teams participating in an event
     * @param {string} eventKey - Event key
     * @returns {Promise} - Promise resolving to event teams
     */
    async getEventTeams(eventKey) {
      return this.fetch(`/event/${eventKey}/teams`);
    }
    
    /**
     * Get matches for an event
     * @param {string} eventKey - Event key
     * @returns {Promise} - Promise resolving to event matches
     */
    async getEventMatches(eventKey) {
      return this.fetch(`/event/${eventKey}/matches`);
    }
    
    /**
     * Get rankings for an event
     * @param {string} eventKey - Event key
     * @returns {Promise} - Promise resolving to event rankings
     */
    async getEventRankings(eventKey) {
      return this.fetch(`/event/${eventKey}/rankings`);
    }
  
    // DISTRICTS ENDPOINTS
    
    /**
     * Get districts for a year
     * @param {number} year - Year (e.g. 2025)
     * @returns {Promise} - Promise resolving to districts
     */
    async getDistricts(year) {
      return this.fetch(`/districts/${year}`);
    }
    
    /**
     * Get events in a district
     * @param {string} districtKey - District key (e.g. 2025fim)
     * @returns {Promise} - Promise resolving to district events
     */
    async getDistrictEvents(districtKey) {
      return this.fetch(`/district/${districtKey}/events`);
    }
  
    // SIMULATED/MOCK DATA METHODS
    // For development without API key or when API is unavailable
    
    /**
     * Get simulated upcoming events
     * @returns {Array} - Array of event objects
     */
    getSimulatedUpcomingEvents() {
      return [
        {
          key: '2025casj',
          name: 'Silicon Valley Regional',
          start_date: '2025-03-14',
          end_date: '2025-03-16',
          city: 'San Jose',
          state_prov: 'CA',
          country: 'USA'
        },
        {
          key: '2025caln',
          name: 'Aerospace Valley Regional',
          start_date: '2025-03-22',
          end_date: '2025-03-24',
          city: 'Lancaster',
          state_prov: 'CA',
          country: 'USA'
        },
        {
          key: '2025chcmp',
          name: 'FIRST Championship - Houston',
          start_date: '2025-04-17',
          end_date: '2025-04-20',
          city: 'Houston',
          state_prov: 'TX',
          country: 'USA'
        }
      ];
    }
    
    /**
     * Get simulated top teams
     * @returns {Array} - Array of team objects
     */
    getSimulatedTopTeams() {
      return [
        { 
          team_number: 254,
          nickname: 'The Cheesy Poofs',
          city: 'San Jose',
          state_prov: 'CA',
          rank: 1
        },
        { 
          team_number: 1114,
          nickname: 'Simbotics',
          city: 'St. Catharines',
          state_prov: 'ON',
          country: 'Canada',
          rank: 3
        },
        { 
          team_number: 2056,
          nickname: 'OP Robotics',
          city: 'Stoney Creek',
          state_prov: 'ON',
          country: 'Canada',
          rank: 2
        }
      ];
    }
    
    /**
     * Get simulated recent matches
     * @returns {Array} - Array of match objects
     */
    getSimulatedRecentMatches() {
      return [
        { 
          key: '2025casj_f1m1', 
          comp_level: 'f', 
          set_number: 1, 
          match_number: 1,
          alliances: {
            red: { 
              score: 89, 
              team_keys: ['frc254', 'frc1114', 'frc118'] 
            },
            blue: { 
              score: 75, 
              team_keys: ['frc2056', 'frc217', 'frc1241'] 
            }
          },
          winning_alliance: 'red',
          event_key: '2025casj'
        },
        { 
          key: '2025casj_sf2m2', 
          comp_level: 'sf', 
          set_number: 2, 
          match_number: 2,
          alliances: {
            red: { 
              score: 65, 
              team_keys: ['frc2056', 'frc217', 'frc1241'] 
            },
            blue: { 
              score: 42, 
              team_keys: ['frc195', 'frc469', 'frc3707'] 
            }
          },
          winning_alliance: 'red',
          event_key: '2025casj'
        },
        { 
          key: '2025casj_sf1m2', 
          comp_level: 'sf', 
          set_number: 1, 
          match_number: 2,
          alliances: {
            red: { 
              score: 92, 
              team_keys: ['frc254', 'frc1114', 'frc118'] 
            },
            blue: { 
              score: 88, 
              team_keys: ['frc33', 'frc1323', 'frc2468'] 
            }
          },
          winning_alliance: 'red',
          event_key: '2025casj'
        }
      ];
    }
    
    /**
     * Get simulated team detail
     * @param {number} teamNumber - Team number
     * @returns {Object} - Team detail object
     */
    getSimulatedTeamDetail(teamNumber) {
      const teams = {
        254: {
          team_number: 254,
          nickname: 'The Cheesy Poofs',
          name: 'NASA Ames Research Center & Bellarmine College Preparatory',
          city: 'San Jose',
          state_prov: 'California',
          country: 'USA',
          rookie_year: 1999,
          website: 'https://team254.com',
          motto: 'Aim High'
        },
        2056: {
          team_number: 2056,
          nickname: 'OP Robotics',
          name: 'Orchard Park Secondary School',
          city: 'Stoney Creek',
          state_prov: 'Ontario',
          country: 'Canada',
          rookie_year: 2007,
          website: 'https://www.oprobotics.ca/',
          motto: 'We design. We build. We compete.'
        }
      };
      
      return teams[teamNumber] || teams[254];
    }
  }
  
  // Create a global instance
  const tbaApi = new TBAApi();