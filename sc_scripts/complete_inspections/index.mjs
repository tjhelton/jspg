import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

const bToken = 'TOKEN_HERE';

const inputCsvPath = 'input.csv';
const outputCsvPath = 'output.csv';

const processCsv = async () => {
  const results = [];

  // Read the CSV file
  fs.createReadStream(inputCsvPath)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      // Process each row
      for (const row of results) {
        const auditId = row.auditId;
        const compDate = '2024-10-24T00:00:00Z';

        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'sc-integration-id': 'sc-readme',
            'content-type': 'application/json',
            authorization: `Bearer ${bToken}`,
          },
          body: JSON.stringify({ timestamp: compDate }),
        };

        try {
          const response = await fetch(`https://api.safetyculture.io/inspections/v1/inspections/${auditId}/complete`, options);

          // Log the full response for debugging
          const responseText = await response.text();
          console.log(`Response for user ${auditId}:`, responseText);

          if (response.ok) {
            row.status = 'SUCCESS';
            console.log(`SUCCESS For: ${auditId}`);
        
          } else {
            row.status = 'ERROR';
            console.error(`Error for user ${auditId}: ${responseText}`);
          }
        } catch (err) {
          row.status = 'ERROR';
          console.error(`Network error for user ${auditId}:`, err);
        }
      }

      // Write the results to a new CSV file
      const csvWriter = createCsvWriter({
        path: outputCsvPath,
        header: [
          { id: 'auditId', title: 'auditId' },
          { id: 'status', title: 'status' },
        ],
      });

      await csvWriter.writeRecords(results);
      console.log('CSV file has been processed and saved as output.csv');
    });
};

processCsv();
