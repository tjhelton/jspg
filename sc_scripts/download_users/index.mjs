const bearerToken = process.argv[2];

async function getUsers(url){
    try {
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              authorization: `Bearer ${bearerToken}`
            }
          };
        
        const response = await fetch(url, options);
    
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
    
        const rawJson = await response.json();

        return rawJson.data;

    } catch (error) {
        console.error('error:', error);
        return [];
    }
}

const resultz = await getUsers('https://api.safetyculture.io/feed/users');

// console.log(resultz);




