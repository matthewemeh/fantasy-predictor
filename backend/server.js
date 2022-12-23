const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const URI = process.env.ATLAS_URI;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB database connection established successfully'));

const teamRouter = require('./routes/teams');
const scoutRouter = require('./routes/scouts');
const playerRouter = require('./routes/players');
const ratingRouter = require('./routes/ratings');
const updateRouter = require('./routes/updates');

app.use('/teams', teamRouter);
app.use('/scouts', scoutRouter);
app.use('/players', playerRouter);
app.use('/ratings', ratingRouter);
app.use('/updates', updateRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
