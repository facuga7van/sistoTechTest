const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, Op } = require('sequelize');
const { Reservation } = require('./models'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './reservations.db',
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

app.get('/statsDaily', async (req, res) => {
  try {
    const { betriebId } = req.query;  
    console.log('Received betriebId parameter:', betriebId); 

    if (!betriebId) {
      return res.status(400).json({ error: 'Missing betriebId parameter' });
    }

    const stats = await Reservation.findAll({
      attributes: [
        [sequelize.fn('strftime', '%w', sequelize.col('createdAt')), 'day_of_week'],
        [sequelize.fn('SUM', sequelize.col('peopleCount')), 'total_people'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_reservations'],
        [sequelize.fn('AVG', sequelize.col('stayTime')), 'average_stay_time'],
      ],
      where: { betriebId },
      group: [sequelize.fn('strftime', '%w', sequelize.col('createdAt'))],
      order: [[sequelize.fn('strftime', '%w', sequelize.col('createdAt'))]],
    });

    if (!stats || stats.length === 0) {
      return res.status(404).json({ message: `No reservations found for the restaurant with ID ${betriebId}` });
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const formattedStats = stats.map(stat => {
      const averageStayTime = stat.dataValues.average_stay_time;

      let formattedStayTime = '0h 0m';
      if (averageStayTime !== null) {
        const hours = Math.floor(averageStayTime / 60);
        const minutes = Math.round(averageStayTime % 60);
        formattedStayTime = `${hours}h ${minutes}m`;
      }

      return {
        day_of_week: daysOfWeek[parseInt(stat.dataValues.day_of_week)],
        total_people: stat.dataValues.total_people,
        total_reservations: stat.dataValues.total_reservations,
        average_stay_time: formattedStayTime,
      };
    });

    res.json(formattedStats);
  } catch (error) {
    console.error('Error retrieving statistics:', error);
    res.status(500).json({ error: 'Error retrieving statistics' });
  }
});

app.get('/statsTotal', async (req, res) => {
  try {
    const { betriebId } = req.query;  
    console.log('Received betriebId parameter:', betriebId); 

    if (!betriebId) {
      return res.status(400).json({ error: 'Missing betriebId parameter' });
    }

    const stats = await Reservation.findAll({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('stayTime')), 'average_stay_time'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN source = 'online' THEN 1 ELSE 0 END")), 'total_online'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN source = 'manual' THEN 1 ELSE 0 END")), 'total_manual'],
      ],
      where: { betriebId },
    });

    if (!stats || stats.length === 0) {
      return res.status(404).json({ message: `No reservations found for the restaurant with ID ${betriebId}` });
    }

    const formattedStats = stats.map(stat => {
      const averageStayTime = stat.dataValues.average_stay_time;

      let formattedStayTime = '0h 0m';
      if (averageStayTime !== null) {
        const totalMinutes = Math.round(averageStayTime);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        formattedStayTime = `${hours}h ${minutes}m`;
      }

      return {
        average_stay_time: formattedStayTime,
        total_online: stat.dataValues.total_online,
        total_manual: stat.dataValues.total_manual,
      };
    });

    res.json(formattedStats);
  } catch (error) {
    console.error('Error retrieving statistics:', error);
    res.status(500).json({ error: 'Error retrieving statistics' });
  }
});

app.get('/statsReservation', async (req, res) => {
  try {
    const { betriebId } = req.query;  
    console.log('Received betriebId parameter:', betriebId); 

    if (!betriebId) {
      return res.status(400).json({ error: 'Missing betriebId parameter' });
    }

    const stats = await Reservation.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'canceled' THEN 1 ELSE NULL END")), 'canceled'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'confirmed' THEN 1 ELSE NULL END")), 'confirmed'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'finished' THEN 1 ELSE NULL END")), 'finished'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'noShow' THEN 1 ELSE NULL END")), 'noShow'],
      ],
      where: { betriebId },
    });

    if (!stats || stats.length === 0) {
      return res.status(404).json({ message: `No reservations found for the restaurant with ID ${betriebId}` });
    }

    const formattedStats = stats.map(stat => ({
      canceled: stat.dataValues.canceled || 0,
      confirmed: stat.dataValues.confirmed || 0,
      finished: stat.dataValues.finished || 0,
      noShow: stat.dataValues.noShow || 0,
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error('Error retrieving reservation statistics:', error);
    res.status(500).json({ error: 'Error retrieving reservation statistics' });
  }
});

app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Reservation.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('betriebId')), 'betriebId']],
      raw: true,
    });

    const restaurantList = restaurants.map(restaurant => restaurant.betriebId);

    res.json(restaurantList);
  } catch (error) {
    console.error('Error retrieving restaurants:', error);
    res.status(500).json({ error: 'Error retrieving restaurants' });
  }
});

app.get('/', (req, res) => {
  res.send('API running successfully');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
