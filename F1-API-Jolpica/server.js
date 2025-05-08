
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Obtener clasificación de pilotos
app.get('/api/driver-standings', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    const drivers = standings.map(d => ({
      position: d.position,
      driver: `${d.Driver.givenName} ${d.Driver.familyName}`,
      nationality: d.Driver.nationality,
      constructor: d.Constructors[0].name,
      points: d.points,
    }));

    res.json(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de pilotos' });
  }
});

// Obtener clasificación de constructores
app.get('/api/constructor-standings', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
    const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    const constructors = standings.map(c => ({
      position: c.position,
      constructor: c.Constructor.name,
      nationality: c.Constructor.nationality,
      points: c.points,
    }));

    res.json(constructors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de constructores' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
