export interface SportCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: SportSubcategory[];
  gradient: string;
}

export interface SportSubcategory {
  id: string;
  name: string;
  description: string;
  reviewTypes: ReviewType[];
}

export interface ReviewType {
  id: string;
  name: string;
  description: string;
  fields: ReviewField[];
}

export interface ReviewField {
  id: string;
  name: string;
  type: 'text' | 'select' | 'rating' | 'date' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export const sportsCategories: SportCategory[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    description: 'Cricket matches, players, and tournaments',
    gradient: 'from-green-500 to-emerald-600',
    subcategories: [
      {
        id: 'match',
        name: 'Match Reviews',
        description: 'Review cricket matches and performances',
        reviewTypes: [
          {
            id: 'match-review',
            name: 'Match Review',
            description: 'Review a cricket match',
            fields: [
              {
                id: 'matchName',
                name: 'Match Name',
                type: 'text',
                required: true,
                placeholder: 'e.g., India vs Australia - 1st Test'
              },
              {
                id: 'matchDate',
                name: 'Match Date',
                type: 'date',
                required: true
              },
              {
                id: 'teamA',
                name: 'Team A',
                type: 'text',
                required: true,
                placeholder: 'e.g., India'
              },
              {
                id: 'teamB',
                name: 'Team B',
                type: 'text',
                required: true,
                placeholder: 'e.g., Australia'
              },
              {
                id: 'venue',
                name: 'Venue',
                type: 'text',
                required: false,
                placeholder: 'e.g., MCG, Melbourne'
              }
            ]
          }
        ]
      },
      {
        id: 'player',
        name: 'Player Reviews',
        description: 'Review individual cricket players',
        reviewTypes: [
          {
            id: 'player-review',
            name: 'Player Review',
            description: 'Review a cricket player',
            fields: [
              {
                id: 'playerName',
                name: 'Player Name',
                type: 'text',
                required: true,
                placeholder: 'e.g., Virat Kohli'
              },
              {
                id: 'playerPosition',
                name: 'Player Position',
                type: 'select',
                required: true,
                options: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper']
              },
              {
                id: 'battingStyle',
                name: 'Batting Style',
                type: 'select',
                required: false,
                options: ['Right-handed', 'Left-handed']
              },
              {
                id: 'bowlingStyle',
                name: 'Bowling Style',
                type: 'select',
                required: false,
                options: ['Fast', 'Medium Fast', 'Spin', 'Off-spin', 'Leg-spin', 'N/A']
              },
              {
                id: 'team',
                name: 'Team',
                type: 'text',
                required: false,
                placeholder: 'e.g., India'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    description: 'Football matches, players, and teams',
    gradient: 'from-blue-500 to-cyan-600',
    subcategories: [
      {
        id: 'match',
        name: 'Match Reviews',
        description: 'Review football matches',
        reviewTypes: [
          {
            id: 'match-review',
            name: 'Match Review',
            description: 'Review a football match',
            fields: [
              {
                id: 'matchName',
                name: 'Match Name',
                type: 'text',
                required: true,
                placeholder: 'e.g., Manchester United vs Liverpool'
              },
              {
                id: 'matchDate',
                name: 'Match Date',
                type: 'date',
                required: true
              },
              {
                id: 'teamA',
                name: 'Home Team',
                type: 'text',
                required: true
              },
              {
                id: 'teamB',
                name: 'Away Team',
                type: 'text',
                required: true
              }
            ]
          }
        ]
      },
      {
        id: 'player',
        name: 'Player Reviews',
        description: 'Review football players',
        reviewTypes: [
          {
            id: 'player-review',
            name: 'Player Review',
            description: 'Review a football player',
            fields: [
              {
                id: 'playerName',
                name: 'Player Name',
                type: 'text',
                required: true
              },
              {
                id: 'playerPosition',
                name: 'Position',
                type: 'select',
                required: true,
                options: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
              },
              {
                id: 'team',
                name: 'Team',
                type: 'text',
                required: false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    description: 'Basketball games and players',
    gradient: 'from-orange-500 to-red-600',
    subcategories: [
      {
        id: 'game',
        name: 'Game Reviews',
        description: 'Review basketball games',
        reviewTypes: [
          {
            id: 'game-review',
            name: 'Game Review',
            description: 'Review a basketball game',
            fields: [
              {
                id: 'gameName',
                name: 'Game Name',
                type: 'text',
                required: true,
                placeholder: 'e.g., Lakers vs Warriors'
              },
              {
                id: 'gameDate',
                name: 'Game Date',
                type: 'date',
                required: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    description: 'Tennis matches and players',
    gradient: 'from-yellow-500 to-green-600',
    subcategories: [
      {
        id: 'match',
        name: 'Match Reviews',
        description: 'Review tennis matches',
        reviewTypes: [
          {
            id: 'match-review',
            name: 'Match Review',
            description: 'Review a tennis match',
            fields: [
              {
                id: 'matchName',
                name: 'Match Name',
                type: 'text',
                required: true,
                placeholder: 'e.g., Federer vs Nadal - Wimbledon Final'
              }
            ]
          }
        ]
      }
    ]
  }
];