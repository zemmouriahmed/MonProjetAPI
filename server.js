require('dotenv').config({ path: './config/.env' });
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // pour parser les requêtes JSON.

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const port = process.env.PORT || 3000;
const User = require('./models/User');

// GET : Renvoie tous les utilisateurs
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST : Ajoute un nouvel utilisateur
app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

// PUT : Modifier un utilisateur par son identifiant
app.put('/users/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

// DELETE : Supprimer un utilisateur par son identifiant
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Ligne existante à conserver pour démarrer le serveur
app.listen(port, () => console.log(`Server running on port ${port}`));
