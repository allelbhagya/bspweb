const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Logs = require('./models/Logs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer();
const cookieParser = require('cookie-parser');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = "qddi10eu90ikj1wqmn";

const allowedOrigins = ['https://bspweb-client.vercel.app', 'https://bspweb-client-6bl1o3f3x-allelbhagya.vercel.app'];

app.use(cors({
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
        }
    }
}));


app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("ok works");
});

mongoose.connect("mongodb+srv://bsp:bsp@bsp.liemt4a.mongodb.net/?retryWrites=true&w=majority");

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt)
    })
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// ... (previous code)


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true }).json({
        id: userDoc._id,
        username,
      });
      console.log('Token set:', token);
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token found' });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    res.json(info);
  });
});


app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/log', upload.none(), async (req, res) => {
  try {
    // Uncomment the line below if you want to allow access without a token
    // const { token } = req.cookies;
    
    // Comment the line below if you want to allow access without a token
    const token = null;

    // jwt.verify(token, secret, {}, async (err, info) => {
    //   if (err) throw err;

    const { time, duration, region, sensorID, stoppage, profile, comment, measure } = req.body;
    const logDoc = await Logs.create({
      time,
      duration,
      region,
      sensorID,
      stoppage,
      profile,
      comment,
      measure,
      initialCobbleTime,
      // Uncomment the line below if you want to include the author field
      // author: info.id,
    });

    res.json(logDoc);
    // });
  } catch (error) {
    console.error('Error in /log endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/log', async (req, res) => {
  res.json(
    await Logs.find()
      .sort({ createdAt: -1 })
  );
});

app.delete('/log/:id', async (req, res) => {
  const logId = req.params.id;
  try {
    const deletedLog = await Logs.findByIdAndDelete(logId);

    if (deletedLog) {
      res.json({ message: 'Log deleted successfully', log: deletedLog });
    } else {
      res.status(404).json({ message: 'Log not found' });
    }
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/log/:id', async (req, res) => {
  try {
    const log = await Logs.findById(req.params.id);
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching log data' });
  }
});

app.put('/log/:id', async (req, res) => {
  const logId = req.params.id;
  const updatedLog = req.body;

  try {
    const updatedLogResult = await Logs.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedLogResult);
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(4000);
