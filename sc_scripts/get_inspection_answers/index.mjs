const auditId = process.argv[2];
const bearerToken = process.argv[3];

async function getAnswers() {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${bearerToken}`
        }
      };
      
      const data = await fetch(`https://api.safetyculture.io/inspections/v1/answers/${auditId}`, options);
      const jsons = await data.json();

      return jsons;
}

const res = await getAnswers();

console.log(res);