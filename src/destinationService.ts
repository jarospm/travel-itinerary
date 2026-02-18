// Shape of the REST Countries API response
type CountryData = {
  currencies: Record<string, { name: string; symbol: string }>;
  flag: string;
};

/** Fetches currency and flag for a country from the REST Countries API. */
export const getDestinationInfo = async (
  countryName: string,
): Promise<{ currency: string; flag: string }> => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`,
    );

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    // API always returns an array of matches — we take the first one
    const data = (await response.json()) as CountryData[];

    return {
      currency: Object.keys(data[0].currencies)[0],
      flag: data[0].flag,
    };
  } catch {
    throw new Error('Could not fetch country data');
  }
};
