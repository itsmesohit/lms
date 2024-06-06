const app = require('./app');

require('dotenv').config(); // Load environment variables from .env file

const PORT = process.env.PORT || 4000; // Use port from environment variable or default to 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
