import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

const bToken = 'TOKEN_HERE';

const inputCsvPath = 'input.csv';
const outputCsvPath = 'output.csv';

const feedMembers = async() => {
  const members = [];


};

const processCsv = async () => {
  const results = [];
  let nextPage = 'https://api.safetyculture.io/feed/site_members';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${bToken}`, // Make sure bToken is defined
    }
  };

  while (nextPage) {
    try {
      const res = await fetch(nextPage, options);
      const data = await res.json();

      // Ensure data.results exists and is an array
      if (data.results && Array.isArray(data.results)) {
        data.results.forEach(item => {
          results.push({ site_id: item.site_id, member_id: item.member_id });
        });
      } else {
        console.log('next page not present');
      }

      // Check for next page
      if (data.metadata && data.metadata.nextpage) {
        results.push(null); // Placeholder for page break
        console.log('Next page exists, loading next page...');
        nextPage = data.metadata.nextpage.startsWith('http')
          ? data.metadata.nextpage
          : `https://api.safetyculture.io${data.metadata.nextpage}`; // Ensure full URL
      } else {
        nextPage = null;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      nextPage = null;
    }
  }

  console.log('Final Results:', results); // Log results after loop finishes
};

processCsv();


  // Read the CSV file
//   fs.createReadStream(inputCsvPath)
//     .pipe(csv())
//     .on('data', (row) => {
//       results.push(row);
//     })
//     .on('end', async () => {
//       // Process each row
//       for (const row of results) {
//         const userId = row.userId;
//         const siteId = row.siteId.toString();

        
        
//         const options = {
//           method: 'DELETE',
//           headers: {
//             accept: 'application/json',
//             'sc-integration-id': 'sc-readme',
//             'content-type': 'application/json',
//             authorization: `Bearer ${bToken}`,
//           }
//         };

//         try {
//           const response = await fetch(`https://api.safetyculture.io/directory/v1/user/${userId}/folders?folder_ids=${siteId}`, options);
//           const data = await response.json();

//           if (response.ok) {
//             row.status = 'SUCCESS';
//             console.log(`${userId} - SUCCESS`)
//           } else {
//             row.status = 'ERROR';
//             console.error(`Error for user ${userId}, ${siteId}: ${data.message}`);
//           }
//         } catch (err) {
//           row.status = 'ERROR';
//           console.error(`Network error for user ${userId}:`, err);
//         }
//       }

//       // Write the results to a new CSV file
//       const csvWriter = createCsvWriter({
//         path: outputCsvPath,
//         header: [
//           { id: 'userId', title: 'userId' },
//           { id: 'siteId', title: 'siteId' },
//           { id: 'status', title: 'status' },
//         ],
//       });

//       await csvWriter.writeRecords(results);
//       console.log('CSV file has been processed and saved as output.csv');
//     });
// };

// processCsv();
