const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/scheme_navigator', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

// Mongoose Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

app.post('/register', async (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;
  try {
    const newUser = new User({
      name: `${first_name} ${last_name}`,
      email,
      phone,
      password
    });
    await newUser.save();
    res.send('Registration successful! <a href="login.html">Login here</a>');
  } catch (err) {
    console.error('Registration error:', err.message);
    res.send('Error occurred during registration. Please try again.');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/registration.html'); // Not registered
    }
    if (user.password === password) {
      return res.send('Login successful! <a href="coverpage.html">Go to Dashboard</a>');
    }
    res.send('Invalid password. <a href="login.html">Try again</a>');
  } catch (err) {
    console.error('Login error:', err.message);
    res.send('Error occurred during login. Please try again.');
  }
});

// Start Server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
