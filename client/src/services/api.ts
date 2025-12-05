// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// API Response Types
export interface TeamApiResponse {
    id: string;
    name: string;
    members?: string[];
    selectedchall?: Array<{ id: string; name: string }>;
}

export interface TeamsApiResponse {
    teams: TeamApiResponse[];
}

// Transformed Team Type for App Usage
export interface Team {
    id: string;
    name: string;
    createdAt: string;
    members: string[]; // Array of member names
    status: 'en_cours' | 'submitted';
    defis: Array<{
        id: number;
        titre: string;
        description: string;
        status: 'en_cours' | 'submitted';
    }>;
    selectedchall: Array<{ id: string; name: string }>;
}

// Challenge Type
export interface Challenge {
    name: string;
    organizer: string;
    theme: string;
    prize: string;
    description: string;
    expectedElements: string[];
    submissionMode: string;
    teams: Array<{ id: string; name: string }>;
    logo: string;
    status: string;
}

/**
 * Fetch teams from the API
 * @returns Promise with array of teams
 */
export async function fetchTeams(): Promise<Team[]> {
    try {
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL is not configured. Please create a .env file with VITE_API_BASE_URL');
        }

        const response = await fetch(`${API_BASE_URL}/teams-principal`);

        if (!response.ok) {
            throw new Error(`Failed to fetch teams: ${response.statusText}`);
        }

        const data: TeamsApiResponse = await response.json();

        // Transform API data to match application Team interface
        // Status is static as requested
        return data.teams.map((team) => ({
            id: team.id,
            name: team.name,
            createdAt: new Date().toISOString(), // Static for now
            members: team.members ?? [], // Use API data if available
            selectedchall: team.selectedchall ?? [], // Use API data if available
            status: 'en_cours' as const, // Static status as requested
            defis: [], // Static empty array for now
        }));
    } catch (error) {
        console.error('Error fetching teams:', error);
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Impossible de se connecter à l\'API. Vérifiez que l\'URL est correcte et que le serveur est accessible.');
        }
        throw error;
    }
}

/**
 * Fetch a single team by ID
 * @param id Team ID
 * @returns Promise with team data or null if not found
 */
export async function fetchTeamById(id: string): Promise<Team | null> {
    try {
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL is not configured. Please create a .env file with VITE_API_BASE_URL');
        }

        const response = await fetch(`${API_BASE_URL}/team/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch team: ${response.statusText}`);
        }

        const data: TeamApiResponse = await response.json();

        // Transform API data to match application Team interface
        // Mock data for specific team id 28
        if (id === '28') {
            return {
                id: data.id,
                name: data.name,
                createdAt: new Date().toISOString(),
                members: [
                    "FIGUEIRAS Jossua",
                    "EVANGELISTA Thomas",
                    "MAUBERT Rémy"
                ],
                selectedchall: [
                    { id: "174", name: "Défi de la nuit 2025" },
                    { id: "444", name: "L'ergonomie : simplifier pour mieux vivre." },
                    { id: "477", name: "Femmes et Informatique" },
                    { id: "483", name: "Hidden Snake 📦" },
                    { id: "494", name: "Chat'bruti" },
                    { id: "501", name: "La Ligue des Extensions : Manifestement à jour, open source et utile." }
                ],
                status: 'en_cours' as const,
                defis: [],
            };
        }

        // Default static mapping
        return {
            id: data.id,
            name: data.name,
            createdAt: new Date().toISOString(),
            members: data.members ?? [],
            selectedchall: data.selectedchall ?? [],
            status: 'en_cours' as const,
            defis: [],
        };
    } catch (error) {
        console.error(`Error fetching team ${id}:`, error);
        throw error;
    }
}

/**
 * Fetch a single challenge by ID
 * @param id Challenge ID
 * @returns Promise with challenge data or null if not found
 */
export async function fetchChallengeById(id: string): Promise<Challenge | null> {
    try {
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL is not configured. Please create a .env file with VITE_API_BASE_URL');
        }

        const response = await fetch(`${API_BASE_URL}/challenge/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch challenge: ${response.statusText}`);
        }

        const data: Challenge = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching challenge ${id}:`, error);
        throw error;
    }
}
