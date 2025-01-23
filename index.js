const express = require('express');
const axios = require('axios');
const requestIp = require('request-ip');
const env = require('dotenv'). config();

const port = process.env.PORT || 4000;

const app = express();


app.use(express.json());
app.use(requestIp.mw());

app.get('/', (req, res) => {
    res.send('Welcome to the weather API!');
});

app.get('/weather/:name', async (req, res) => {
    try {
    const ip = req.clientIp;
    const name = req.params.name;

const location = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEO_API}&ip=${ip}`);

    console.log(location);
    
    const lat = location.data.latitude;
    const lon = location.data.longitude;
console.log(process.env.WEATHER_API);

   const weather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}&q=${lat},${lon}`);
    console.log(weather);
    
  const temp = weather.data.current.temp_c;

  const message = `Hello ${name}, The temperature in ${location.data.city} is ${temp}°C`;


  return res.status(200).json({message: message});
   
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
})


app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
