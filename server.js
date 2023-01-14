const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

// Get User
const users = [];
app.get('/users', (req, res) => {
  res.json(users);
});

// Create User
app.post('/users', async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // OR
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // console.log(salt);
    // console.log(hashedPassword);

    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).json({
      status: 'success',
      message: 'User created.',
    });
  } catch {
    res.status(500).json({
      status: 'error',
      message: 'Server Error!',
    });
  }
});

// Authenticate User
app.post('/users/login', async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null)
    return res.status(400).json({
      status: 'fail!',
      message: 'User not found!',
    });
  try {
    if (await bcrypt.compare(req.body.password, user.password)) res.status(200).send('Success');
    else res.status(401).send('Not Allowed!');
  } catch {
    res.status(500).json({
      status: 'error',
      message: 'Server Error!',
    });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
