const express= require('express');
const cors= require('cors');
require('dotenv').config();

const vehicleRoutes = require('./routes/vehicleRoutes');
const refuelingRoutes = require('./routes/refuelingRoutes');
const oilChangeRoutes = require('./routes/oilChangeRoutes');
const serviceNoteRoutes = require('./routes/serviceNoteRoutes');

const app= express();
const PORT= process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

app.use(cors());
app.use(express.json());

const path = require('path');

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/vehicles',vehicleRoutes);
app.use('/api/vehicles/:vehicleId/refueling', refuelingRoutes);
app.use('/api/vehicles/:vehicleId/oil-changes', oilChangeRoutes);
app.use('/api/vehicles/:vehicleId/service-notes', serviceNoteRoutes);

app.get('/',(req,res)=> {
    res.json({message: 'Vehicle Data Logging API is running'});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});