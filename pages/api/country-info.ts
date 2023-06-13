import { NextApiRequest, NextApiResponse } from 'next';

async function getCountriesUsingCurrency(currencyCode: string) {
  const soapRequest = `
  <?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <CountriesUsingCurrency xmlns="http://www.oorsprong.org/websamples.countryinfo">
        <sISOCurrencyCode>${currencyCode}</sISOCurrencyCode>
      </CountriesUsingCurrency>
    </soap12:Body>
  </soap12:Envelope>
  `;

  const url =
      'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/soap+xml;charset=UTF-8',
      'Accept-Encoding': 'gzip,deflate',
      SOAPAction:
          'http://www.oorsprong.org/websamples.countryinfo/CountriesUsingCurrency',
    },
    body: soapRequest,
  });

  const textData = await response.text();

  const xmlData = new window.DOMParser().parseFromString(textData, 'text/xml');
  const tCountryCodeAndName = xmlData.querySelector('tCountryCodeAndName');

  if (!tCountryCodeAndName) {
    return { tCountryCodeAndName: [] };
  }

  const countries = Array.from(tCountryCodeAndName.children).map((country) => ({
    sISOCode: country.querySelector('sISOCode')?.textContent,
    sName: country.querySelector('sName')?.textContent,
  }));

  return { tCountryCodeAndName: countries };
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