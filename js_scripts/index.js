const fs = require('fs'); // Node.js built-in module for file system operations

// Function to read a file and log its content
function readFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        console.log('File content:\n', data);
    });
}

// Call the function with a file path
const filePath = './sample.txt'; // Replace with your file path
readFile(filePath);