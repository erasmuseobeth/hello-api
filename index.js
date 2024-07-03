const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Define the fixed IP address and client IP address variables
const fixedIpAddress = '196.220.66.189'; // Replace with your fixed IP address





// Root endpoint
app.get('/', async (req, res) => {

  res.json({
    message: 'Welcome to the Home API endpoint',
    endpoints: {
      home: '/',
      api: '/api',
      hello: '/api/hello',  
    }
  });
});

// API endpoint
app.get('/api', async (req, res) => {
  res.json({
    message: 'API DOCS endpoint',
    endpoints: {
      home: '/',
      api: '/api',
      hello: '/api/hello',  // Assuming you have a /api/hello endpoint
      // Add more endpoints as needed
    }
  });
});


app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  
  // Determine which IP address to use based on `useFixedIpAddress` flag
  clientIp = fixedIpAddress
  // const clientIp =  req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const sanitizedIp = clientIp.includes('::') ? '127.0.0.1' : clientIp;

  try {
    // Fetch location data from ipgeolocation
    const geoApiKey = '4f846836f2134d4f8f31b22540052ce1';
    const geoResponse = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${sanitizedIp}`);
    const { city } = geoResponse.data;

    // Fetch weather data from WeatherAPI
    const weatherApiKey = '024f9efda06141ee8de55316240307';
    const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}`);
    const temperature = weatherResponse.data.current.temp_c;

    res.json({
      client_ip: sanitizedIp,
      location: city,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
