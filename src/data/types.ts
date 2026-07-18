import type { TypeChart, TypeNames } from "@/lib/types";

export const TYPE_CHART: TypeChart = {
  "normal": {
    "weak": [
      "fighting"
    ],
    "resist": [],
    "immune": [
      "ghost"
    ],
    "strong": []
  },
  "fire": {
    "weak": [
      "water",
      "ground",
      "rock"
    ],
    "resist": [
      "fire",
      "grass",
      "ice",
      "bug",
      "steel",
      "fairy"
    ],
    "immune": [],
    "strong": [
      "grass",
      "ice",
      "bug",
      "steel"
    ]
  },
  "water": {
    "weak": [
      "electric",
      "grass"
    ],
    "resist": [
      "fire",
      "water",
      "ice",
      "steel"
    ],
    "immune": [],
    "strong": [
      "fire",
      "ground",
      "rock"
    ]
  },
  "grass": {
    "weak": [
      "fire",
      "ice",
      "poison",
      "flying",
      "bug"
    ],
    "resist": [
      "water",
      "electric",
      "grass",
      "ground"
    ],
    "immune": [],
    "strong": [
      "water",
      "ground",
      "rock"
    ]
  },
  "electric": {
    "weak": [
      "ground"
    ],
    "resist": [
      "electric",
      "flying",
      "steel"
    ],
    "immune": [],
    "strong": [
      "water",
      "flying"
    ]
  },
  "ice": {
    "weak": [
      "fire",
      "fighting",
      "rock",
      "steel"
    ],
    "resist": [
      "ice"
    ],
    "immune": [],
    "strong": [
      "grass",
      "ground",
      "flying",
      "dragon"
    ]
  },
  "fighting": {
    "weak": [
      "flying",
      "psychic",
      "fairy"
    ],
    "resist": [
      "bug",
      "rock",
      "dark"
    ],
    "immune": [],
    "strong": [
      "normal",
      "ice",
      "rock",
      "dark",
      "steel"
    ]
  },
  "poison": {
    "weak": [
      "ground",
      "psychic"
    ],
    "resist": [
      "grass",
      "fighting",
      "poison",
      "bug",
      "fairy"
    ],
    "immune": [],
    "strong": [
      "grass",
      "fairy"
    ]
  },
  "ground": {
    "weak": [
      "water",
      "grass",
      "ice"
    ],
    "resist": [
      "poison",
      "rock"
    ],
    "immune": [
      "electric"
    ],
    "strong": [
      "fire",
      "electric",
      "poison",
      "rock",
      "steel"
    ]
  },
  "flying": {
    "weak": [
      "electric",
      "ice",
      "rock"
    ],
    "resist": [
      "grass",
      "fighting",
      "bug"
    ],
    "immune": [
      "ground"
    ],
    "strong": [
      "grass",
      "fighting",
      "bug"
    ]
  },
  "psychic": {
    "weak": [
      "bug",
      "ghost",
      "dark"
    ],
    "resist": [
      "fighting",
      "psychic"
    ],
    "immune": [],
    "strong": [
      "fighting",
      "poison"
    ]
  },
  "bug": {
    "weak": [
      "fire",
      "flying",
      "rock"
    ],
    "resist": [
      "grass",
      "fighting",
      "ground"
    ],
    "immune": [],
    "strong": [
      "grass",
      "psychic",
      "dark"
    ]
  },
  "rock": {
    "weak": [
      "water",
      "grass",
      "fighting",
      "ground",
      "steel"
    ],
    "resist": [
      "normal",
      "fire",
      "poison",
      "flying"
    ],
    "immune": [],
    "strong": [
      "fire",
      "ice",
      "flying",
      "bug"
    ]
  },
  "ghost": {
    "weak": [
      "ghost",
      "dark"
    ],
    "resist": [
      "poison",
      "bug"
    ],
    "immune": [
      "normal",
      "fighting"
    ],
    "strong": [
      "psychic",
      "ghost"
    ]
  },
  "dragon": {
    "weak": [
      "ice",
      "dragon",
      "fairy"
    ],
    "resist": [
      "fire",
      "water",
      "grass",
      "electric"
    ],
    "immune": [],
    "strong": [
      "dragon"
    ]
  },
  "dark": {
    "weak": [
      "fighting",
      "bug",
      "fairy"
    ],
    "resist": [
      "ghost",
      "dark"
    ],
    "immune": [
      "psychic"
    ],
    "strong": [
      "psychic",
      "ghost"
    ]
  },
  "steel": {
    "weak": [
      "fire",
      "fighting",
      "ground"
    ],
    "resist": [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "rock",
      "dragon",
      "steel",
      "fairy"
    ],
    "immune": [
      "poison"
    ],
    "strong": [
      "ice",
      "rock",
      "fairy"
    ]
  },
  "fairy": {
    "weak": [
      "poison",
      "steel"
    ],
    "resist": [
      "fighting",
      "bug",
      "dark"
    ],
    "immune": [
      "dragon"
    ],
    "strong": [
      "fighting",
      "dragon",
      "dark"
    ]
  }
};

export const TYPE_NAMES: TypeNames = {
  "normal": "Normal",
  "fire": "Fogo",
  "water": "Agua",
  "grass": "Planta",
  "electric": "Eletrico",
  "ice": "Gelo",
  "fighting": "Lutador",
  "poison": "Venenoso",
  "ground": "Terra",
  "flying": "Voador",
  "psychic": "Psiquico",
  "bug": "Inseto",
  "rock": "Pedra",
  "ghost": "Fantasma",
  "dragon": "Dragao",
  "dark": "Sombrio",
  "steel": "Aco",
  "fairy": "Fada"
};
