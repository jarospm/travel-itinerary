export const getDestinationInfo = async (countryName: string) => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/$
{countryName}`);
    const data = await response.json();
    return {
      currency: Object.keys(data[0].currencies)[0],
      flag: data[0].flag,
    };
  } catch (error) {
    throw new Error('Could not fetch country data');
  }
};
