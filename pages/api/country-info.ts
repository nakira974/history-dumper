import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

async function getCountriesUsingCurrency(currencyCode: string) {
  const data = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <CountriesUsingCurrency xmlns="http://www.oorsprong.org/websamples.countryinfo">
          <sISOCurrencyCode>${currencyCode}</sISOCurrencyCode>
        </CountriesUsingCurrency>
      </soap:Body>
    </soap:Envelope>`;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url:
        'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction:
          'http://www.oorsprong.org/websamples.countryinfo/CountriesUsingCurrency',
    },
    data,
  };

  const response = await axios(config);
  const xmlData = response.data;

  // Parse the XML data and extract the relevant information
  const parser = new window.DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
  const tCountryCodeAndName = xmlDoc.querySelector(
      'CountriesUsingCurrencyResult tCountryCodeAndName',
  )?.children;

  if (tCountryCodeAndName) {
    const countries = Array.from(tCountryCodeAndName).map((country) => ({
      sISOCode: country.querySelector('sISOCode')?.textContent,
      sName: country.querySelector('sName')?.textContent,
    }));
    return { tCountryCodeAndName: countries };
  }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { ISOCurrencyCode } = req.query;

    const data = await getCountriesUsingCurrency(ISOCurrencyCode as string);

    res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}