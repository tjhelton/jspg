import fetch from 'node-fetch';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

const bToken = 'TOKEN_HERE';
const outputCsvPath = 'output.csv';

const processCsv = async () => {
  const results = [];
  let nextPage = 'https://api.safetyculture.io/feed/site_members';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${bToken}`,
    },
  };

  while (nextPage) {
    try {
      const res = await fetch(nextPage, options);
      const data = await res.json();

      if (data.results && Array.isArray(data.results)) {
        data.results.forEach((item) => {
          results.push({ site_id: item.site_id, member_id: item.member_id });
        });
      }

      if (data.metadata && data.metadata.nextpage) {
        nextPage = data.metadata.nextpage.startsWith('http')
          ? data.metadata.nextpage
          : `https://api.safetyculture.io${data.metadata.nextpage}`;
      } else {
        nextPage = null;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      nextPage = null;
    }
  }

  if (results.length > 0) {
    const csvWriter = createCsvWriter({
      path: outputCsvPath,
      header: [
        { id: 'site_id', title: 'Site ID' },
        { id: 'member_id', title: 'Member ID' },
      ],
    });

    try {
      await csvWriter.writeRecords(results);
      console.log('Results have been written to output.csv');
    } catch (err) {
      console.error('Error writing to CSV:', err);
    }
  } else {
    console.log('No data to write to CSV.');
  }
};

processCsv();