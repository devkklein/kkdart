# kkdart Project

## Overview
The kkdart project is a dart game application that includes both human and AI players. The application allows users to play X01 matches, track player statistics, and interact with a database using Supabase. The AI player logic is designed to provide various levels of challenge, from basic to professional strategies.

## Project Structure
```
kkdart
├── server
│   ├── api
│   │   └── webSocket
│   │       └── handlers
│   │           ├── saveX01Match.ts
│   │           └── aiPlayerHandler.ts
│   └── ai
│       ├── models
│       │   ├── aiPlayer.ts
│       │   └── difficultyLevels.ts
│       ├── strategies
│       │   ├── basicStrategy.ts
│       │   ├── advancedStrategy.ts
│       │   └── proStrategy.ts
│       └── utils
│           ├── dartBoardGeometry.ts
│           ├── probabilityCalculator.ts
│           └── decisionTree.ts
├── types
│   ├── websocket.ts
│   └── ai.ts
└── README.md
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Install the required dependencies using your package manager of choice (e.g., npm or yarn).
3. Set up your Supabase project and configure the environment variables for `SUPABASE_URL` and `SUPABASE_KEY`.
4. Run the server to start the application.

## Usage Guidelines
- To start a new match, use the appropriate API endpoint to initialize the game.
- Players can join the match, and AI players will be instantiated based on the selected difficulty level.
- The game state is updated in real-time, and player statistics are saved to the database.

## AI Player Logic Implementation
The AI player logic is implemented in the `server/ai` directory, which includes:

- **Models**: 
  - `aiPlayer.ts`: Defines the AIPlayer class with properties and methods for decision-making.
  - `difficultyLevels.ts`: Contains constants for different AI difficulty levels (Easy, Medium, Hard).

- **Strategies**: 
  - `basicStrategy.ts`: Implements a simple decision-making strategy for AI players.
  - `advancedStrategy.ts`: Provides a more complex strategy that considers various game factors.
  - `proStrategy.ts`: Contains advanced algorithms for professional-level AI performance.

- **Utilities**: 
  - `dartBoardGeometry.ts`: Utility functions for dartboard calculations.
  - `probabilityCalculator.ts`: Functions for calculating scoring probabilities.
  - `decisionTree.ts`: Implements a decision tree for informed AI choices.

## Conclusion
The kkdart project combines real-time gameplay with intelligent AI opponents, providing an engaging experience for users. The modular structure allows for easy updates and enhancements to both the game mechanics and AI strategies.