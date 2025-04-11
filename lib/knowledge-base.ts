// Knowledge base for fundamental facts verification
export const knowledgeBase = {
  geography: {
    continents: [
      {
        name: 'Africa',
        countries: ['Egypt', 'Nigeria', 'South Africa', 'Kenya', 'Ethiopia', 'Ghana', 'Morocco', 'Tanzania']
      },
      {
        name: 'Antarctica',
        countries: []
      },
      {
        name: 'Asia',
        countries: ['China', 'India', 'Japan', 'South Korea', 'Vietnam', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines', 'Saudi Arabia', 'Iran', 'Iraq', 'Israel', 'Turkey', 'Russia']
      },
      {
        name: 'Australia',
        countries: ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji']
      },
      {
        name: 'Europe',
        countries: ['United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Ukraine', 'Russia', 'Sweden', 'Norway', 'Finland', 'Denmark', 'Greece']
      },
      {
        name: 'North America',
        countries: ['United States', 'Canada', 'Mexico', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Costa Rica', 'Panama']
      },
      {
        name: 'South America',
        countries: ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay']
      }
    ],
    population: {
      mostPopulated: {
        country: 'India',
        population: '1.428 billion',
        asOf: '2023',
        source: 'United Nations',
        previousRecord: {
          country: 'China',
          population: '1.426 billion',
          asOf: '2023'
        }
      },
      countries: [
        { name: 'India', population: 1428000000, rank: 1 },
        { name: 'China', population: 1426000000, rank: 2 },
        { name: 'United States', population: 335000000, rank: 3 },
        { name: 'Indonesia', population: 277000000, rank: 4 },
        { name: 'Pakistan', population: 240000000, rank: 5 }
      ]
    },
    countries: {
      'United States': {
        continent: 'North America',
        capital: 'Washington, D.C.',
        aliases: ['USA', 'US', 'America', 'United States of America']
      },
      'Canada': {
        continent: 'North America',
        capital: 'Ottawa'
      },
      'United Kingdom': {
        continent: 'Europe',
        capital: 'London',
        aliases: ['UK', 'Britain', 'Great Britain']
      },
      'China': {
        continent: 'Asia',
        capital: 'Beijing'
      },
      'Russia': {
        continent: 'Asia/Europe',
        capital: 'Moscow',
        notes: 'Russia spans both Europe and Asia'
      },
      'Australia': {
        continent: 'Australia',
        capital: 'Canberra',
        notes: 'Australia is both a country and a continent'
      }
    },
    oceans: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Southern Ocean', 'Arctic Ocean']
  },
  science: {
    elements: [
      'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon'
    ],
    planets: [
      { name: 'Mercury', type: 'planet' },
      { name: 'Venus', type: 'planet' },
      { name: 'Earth', type: 'planet' },
      { name: 'Mars', type: 'planet' },
      { name: 'Jupiter', type: 'planet' },
      { name: 'Saturn', type: 'planet' },
      { name: 'Uranus', type: 'planet' },
      { name: 'Neptune', type: 'planet' },
      { name: 'Pluto', type: 'dwarf planet', notes: 'Reclassified as a dwarf planet in 2006' }
    ]
  },
  history: {
    worldWars: [
      { name: 'World War I', period: '1914-1918' },
      { name: 'World War II', period: '1939-1945' }
    ],
    usPresidents: [
      { name: 'George Washington', period: '1789-1797' },
      { name: 'Joe Biden', period: '2021-present', number: 46 }
    ]
  }
};

// Function to check if a string refers to a country
export function isCountry(text: string): { isCountry: boolean; countryInfo?: any } {
  // Clean and normalize the text
  const normalizedText = text.toLowerCase().trim();

  // Direct match with country name
  for (const country in knowledgeBase.geography.countries) {
    if (country.toLowerCase() === normalizedText) {
      return { isCountry: true, countryInfo: knowledgeBase.geography.countries[country] };
    }

    // Check aliases if they exist
    const countryData = knowledgeBase.geography.countries[country];
    if (countryData.aliases && countryData.aliases.some(alias => alias.toLowerCase() === normalizedText)) {
      return { isCountry: true, countryInfo: countryData };
    }
  }

  // Check all continents' country lists
  for (const continent of knowledgeBase.geography.continents) {
    if (continent.countries.some(country => country.toLowerCase() === normalizedText)) {
      return { isCountry: true };
    }
  }

  return { isCountry: false };
}

// Function to check if a string refers to a continent
export function isContinent(text: string): { isContinent: boolean; continentInfo?: any } {
  // Clean and normalize the text
  const normalizedText = text.toLowerCase().trim();

  // Check against continent names
  for (const continent of knowledgeBase.geography.continents) {
    if (continent.name.toLowerCase() === normalizedText) {
      return { isContinent: true, continentInfo: continent };
    }
  }

  return { isContinent: false };
}

// Function to verify basic geographical facts
export function verifyGeographicalFact(claim: string): { isAccurate: boolean; explanation: string; confidence: number } | null {
  // Convert to lowercase for easier matching
  const lowerClaim = claim.toLowerCase();

  // Check for continent claims
  if (lowerClaim.includes('continent')) {
    // Extract potential continent or country name
    const words = lowerClaim.split(/\s+/);

    for (const word of words) {
      // Skip common words
      if (['a', 'the', 'is', 'are', 'in', 'on', 'and', 'or', 'not', 'continent'].includes(word)) continue;

      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (cleanWord.length < 2) continue;

      // Check for country being incorrectly called a continent
      const countryCheck = isCountry(cleanWord);
      if (countryCheck.isCountry) {
        // If we have specific country info
        if (countryCheck.countryInfo) {
          const countryName = Object.keys(knowledgeBase.geography.countries).find(
            name => name.toLowerCase() === cleanWord ||
                   (knowledgeBase.geography.countries[name].aliases &&
                    knowledgeBase.geography.countries[name].aliases.some(alias => alias.toLowerCase() === cleanWord))
          );

          return {
            isAccurate: false,
            explanation: `${countryName} is a country located in ${countryCheck.countryInfo.continent}, not a continent itself.`,
            confidence: 98
          };
        } else {
          return {
            isAccurate: false,
            explanation: `${cleanWord.toUpperCase()} appears to be a country, not a continent.`,
            confidence: 90
          };
        }
      }

      // Check if it's actually a continent
      const continentCheck = isContinent(cleanWord);
      if (continentCheck.isContinent) {
        return {
          isAccurate: true,
          explanation: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} is indeed one of the seven continents of the world.`,
          confidence: 99
        };
      }
    }

    // Special case for "USA is a continent" or similar
    if (lowerClaim.includes('usa is a continent') ||
        lowerClaim.includes('us is a continent') ||
        lowerClaim.includes('united states is a continent') ||
        lowerClaim.includes('america is a continent')) {
      return {
        isAccurate: false,
        explanation: 'The United States of America (USA) is a country located in North America, not a continent itself.',
        confidence: 99
      };
    }
  }

  // If we couldn't verify with our knowledge base, return null
  return null;
}

// Function to verify scientific facts
export function verifyScientificFact(claim: string): { isAccurate: boolean; explanation: string; confidence: number } | null {
  // Convert to lowercase for easier matching
  const lowerClaim = claim.toLowerCase();

  // Check for planet claims
  if (lowerClaim.includes('planet')) {
    // Check for Pluto being called a planet
    if (lowerClaim.includes('pluto is a planet')) {
      return {
        isAccurate: false,
        explanation: 'Pluto was reclassified as a dwarf planet in 2006 by the International Astronomical Union (IAU).',
        confidence: 98
      };
    }

    // Check for correct planet claims
    for (const celestialBody of knowledgeBase.science.planets) {
      if (lowerClaim.includes(`${celestialBody.name.toLowerCase()} is a planet`)) {
        if (celestialBody.type === 'planet') {
          return {
            isAccurate: true,
            explanation: `${celestialBody.name} is indeed one of the eight planets in our solar system.`,
            confidence: 99
          };
        } else {
          return {
            isAccurate: false,
            explanation: `${celestialBody.name} is classified as a ${celestialBody.type}, not a planet. ${celestialBody.notes}`,
            confidence: 98
          };
        }
      }
    }
  }

  // If we couldn't verify with our knowledge base, return null
  return null;
}

// Function to verify population-related claims
export function verifyPopulationFact(claim: string): { isAccurate: boolean; explanation: string; confidence: number } | null {
  // Convert to lowercase for easier matching
  const lowerClaim = claim.toLowerCase();

  // Check for most populated country claims
  if (lowerClaim.includes('most populated') ||
      lowerClaim.includes('most populous') ||
      lowerClaim.includes('highest population') ||
      lowerClaim.includes('largest population')) {

    // Check for China being incorrectly called the most populated
    if (lowerClaim.includes('china') &&
        (lowerClaim.includes('most populated country') ||
         lowerClaim.includes('most populous country') ||
         lowerClaim.includes('highest population') ||
         lowerClaim.includes('largest population'))) {

      const mostPopulated = knowledgeBase.geography.population.mostPopulated;
      return {
        isAccurate: false,
        explanation: `As of ${mostPopulated.asOf}, ${mostPopulated.country} is the world's most populated country with approximately ${mostPopulated.population}, according to ${mostPopulated.source}. ${mostPopulated.previousRecord.country} is now the second most populated with ${mostPopulated.previousRecord.population}.`,
        confidence: 98
      };
    }

    // Check for India being correctly called the most populated
    if (lowerClaim.includes('india') &&
        (lowerClaim.includes('most populated country') ||
         lowerClaim.includes('most populous country') ||
         lowerClaim.includes('highest population') ||
         lowerClaim.includes('largest population'))) {

      const mostPopulated = knowledgeBase.geography.population.mostPopulated;
      return {
        isAccurate: true,
        explanation: `As of ${mostPopulated.asOf}, ${mostPopulated.country} is indeed the world's most populated country with approximately ${mostPopulated.population}, according to ${mostPopulated.source}. It recently surpassed ${mostPopulated.previousRecord.country} which has ${mostPopulated.previousRecord.population}.`,
        confidence: 98
      };
    }
  }

  // Check for specific population ranking claims
  for (const country of knowledgeBase.geography.population.countries) {
    if (lowerClaim.includes(country.name.toLowerCase()) &&
        (lowerClaim.includes('rank') || lowerClaim.includes('position'))) {

      // Check if the claim mentions the correct rank
      if (lowerClaim.includes(`rank ${country.rank}`) ||
          lowerClaim.includes(`${getOrdinal(country.rank)} most`)) {
        return {
          isAccurate: true,
          explanation: `${country.name} is indeed ranked ${getOrdinal(country.rank)} in world population with approximately ${(country.population / 1000000000).toFixed(3)} billion people.`,
          confidence: 97
        };
      }

      // Check for incorrect rank claims
      for (let i = 1; i <= 5; i++) {
        if (i !== country.rank &&
            (lowerClaim.includes(`rank ${i}`) ||
             lowerClaim.includes(`${getOrdinal(i)} most`))) {

          const correctCountry = knowledgeBase.geography.population.countries.find(c => c.rank === i);
          return {
            isAccurate: false,
            explanation: `${country.name} is not ranked ${getOrdinal(i)} in world population. It is actually ranked ${getOrdinal(country.rank)}. ${correctCountry.name} is ranked ${getOrdinal(i)} with approximately ${(correctCountry.population / 1000000000).toFixed(3)} billion people.`,
            confidence: 97
          };
        }
      }
    }
  }

  // If we couldn't verify with our knowledge base, return null
  return null;
}

// Helper function to get ordinal suffix
function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Main function to verify facts against our knowledge base
export function verifyFactWithKnowledgeBase(claim: string): { isAccurate: boolean; explanation: string; confidence: number } | null {
  // Try geographical fact verification
  const geoResult = verifyGeographicalFact(claim);
  if (geoResult) return geoResult;

  // Try population fact verification
  const populationResult = verifyPopulationFact(claim);
  if (populationResult) return populationResult;

  // Try scientific fact verification
  const scienceResult = verifyScientificFact(claim);
  if (scienceResult) return scienceResult;

  // If we couldn't verify with any of our specialized verifiers, return null
  return null;
}
