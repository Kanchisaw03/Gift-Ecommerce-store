const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'my-project', 'src', 'seller', 'components', 'ProductForm.jsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of disabled={loading} with disabled={submitting}
content = content.replace(/disabled={loading}/g, 'disabled={submitting}');

// Write the updated content back to the file
fs.writeFileSync(filePath, content);

console.log('Successfully updated ProductForm.jsx');
