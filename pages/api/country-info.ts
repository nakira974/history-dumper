import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

import { DOMParser, XMLSerializer } from 'xmldom';

const serializer = new XMLSerializer();
(global as any).XMLSerializer = XMLSerializer;
(global as any).DOMParser = DOMParser;
(global as any).serializer = serializer;

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
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, 'text/xml');

  const tCountryCodeAndNameList = xmlDoc.getElementsByTagName('m:tCountryCodeAndName');

  if (tCountryCodeAndNameList.length > 0) {
    const countries = Array.from(tCountryCodeAndNameList).map((country) => ({
      sISOCode: country.getElementsByTagName('m:sISOCode')[0].textContent,
      sName: country.getElementsByTagName('m:sName')[0].textContent,
    }));
    return { tCountryCodeAndName: countries };
  }

  return { tCountryCodeAndName: [] };
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
