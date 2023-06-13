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

    const getCountriesUsingCurrency = async () => {
        const url = `/api/country-info?ISOCurrencyCode=${currencyCode}`;

        const response = await fetch(url);
        const data = await response.json();

        setCountries(data.tCountryCodeAndName);
    };

    return (
        <>
            <button onClick={getCountriesUsingCurrency}>
                Get countries using {currencyCode}
            </button>
            <ul>
                {countries.map((country) => (
                    <li key={country.sISOCode}>
                        {country.sName} ({country.sISOCode})
                    </li>
                ))}
            </ul>
        </>
    );
};

export default CurrencyCountries;