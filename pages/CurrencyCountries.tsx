import { useState } from 'react';

type Country = {
    sISOCode: string;
    sName: string;
};

type CurrencyCountriesResponse = {
    tCountryCodeAndName: Country[];
};

type CurrencyCountriesProps = {
    currencyCode: string;
};

const CurrencyCountries = ({ currencyCode }: CurrencyCountriesProps) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [inputValue, setInputValue] = useState<string>(currencyCode);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const getCountriesUsingCurrency = async () => {
        setIsLoading(true);
        const url = `/api/country-info?ISOCurrencyCode=${inputValue}`;

        const response = await fetch(url);
        const data = await response.json();

        setCountries(data.tCountryCodeAndName);
        setIsLoading(false);
    };

    return (
        <div>
            <label htmlFor="currency" className="block text-gray-700 font-bold mb-2">
                Currency code:
            </label>
            <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
                <input
                    id="currency"
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                />
                <button
                    type="button"
                    onClick={getCountriesUsingCurrency}
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                >
                    {isLoading ? 'Loading...' : `Get countries using ${inputValue}`}
                </button>
            </div>
            <ul className="mt-4">
                {countries.map((country, index) => (
                    <li
                        key={country.sISOCode}
                        className={`px-4 py-3 ${index % 2 === 0 ? 
                            'bg-gray-950' : 'bg-gray-800'}
                             ${(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) 
                            ? 'dark:bg-gray-700' : 'dark:bg-gray-950'}`}
                    >
                        <div>
                            <span className="text-lg font-bold">{country.sName}</span>
                            <span className="text-sm text-gray-500 ml-2">{country.sISOCode}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrencyCountries;
