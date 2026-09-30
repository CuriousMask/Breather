require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Garden = require('../models/Garden');
const Room = require('../models/Room');
const Soundscape = require('../models/Soundscape');
const Preference = require('../models/Preference');
const Creation = require('../models/Creation');

const seed = async () => {
  await connectDB();
  console.log('🌱  Seeding database...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Garden.deleteMany({}),
    Room.deleteMany({}),
    Soundscape.deleteMany({}),
    Preference.deleteMany({}),
    Creation.deleteMany({}),
  ]);

  // Create sample users
  const users = await User.insertMany([
    { name: 'Alex Rivera', email: 'alex@breather.app', password: 'password123' },
    { name: 'Maya Patel',  email: 'maya@breather.app', password: 'password123' },
  ]);

  const [alex, maya] = users;

  // Create gardens
  await Garden.create({
    userId: alex._id,
    objects: [
      { id: 'obj1', type: 'tree',   variant: 'oak',    x: 150, y: 200, scale: 1.2, rotation: 0, zIndex: 2 },
      { id: 'obj2', type: 'flower', variant: 'tulip',  x: 300, y: 350, scale: 0.8, rotation: 0, zIndex: 1 },
      { id: 'obj3', type: 'stone',  variant: 'round',  x: 450, y: 300, scale: 1,   rotation: 0, zIndex: 1 },
      { id: 'obj4', type: 'water',  variant: 'pond',   x: 600, y: 250, scale: 1.5, rotation: 0, zIndex: 1 },
    ],
    environment: 'day',
    weather: 'clear',
    theme: 'spring',
  });

  // Create rooms
  await Room.create({
    userId: maya._id,
    objects: [
      { id: 'r1', type: 'sofa',       variant: 'sectional', x: 200, y: 300, scale: 1,   rotation: 0,  zIndex: 2 },
      { id: 'r2', type: 'plant',      variant: 'monstera',  x: 500, y: 200, scale: 0.9, rotation: 0,  zIndex: 1 },
      { id: 'r3', type: 'lamp',       variant: 'floor',     x: 100, y: 200, scale: 1,   rotation: 0,  zIndex: 3 },
      { id: 'r4', type: 'books',      variant: 'stack',     x: 350, y: 400, scale: 0.7, rotation: 15, zIndex: 1 },
    ],
    theme: 'cozy',
    wallColor: '#F8F4EE',
    floorColor: '#D4A574',
    lighting: 'warm',
  });

  // Create soundscapes
  await Soundscape.insertMany([
    {
      userId: alex._id,
      name: 'Study Session',
      sounds: [
        { id: 'rain',      name: 'Rain',      volume: 0.6, enabled: true },
        { id: 'fireplace', name: 'Fireplace', volume: 0.4, enabled: true },
      ],
      masterVolume: 0.7,
    },
    {
      userId: maya._id,
      name: 'Deep Relaxation',
      sounds: [
        { id: 'ocean',  name: 'Ocean',  volume: 0.8, enabled: true },
        { id: 'wind',   name: 'Wind',   volume: 0.3, enabled: true },
      ],
      masterVolume: 0.8,
    },
  ]);

  // Create preferences
  await Preference.insertMany([
    {
      userId: alex._id,
      favoriteEnvironment: 'forest',
      lastEnvironment: 'ocean',
      favoriteActivity: 'bubble-pop',
      recentModules: ['garden', 'soundscape', 'escape'],
      theme: 'light',
    },
    {
      userId: maya._id,
      favoriteEnvironment: 'night-sky',
      lastEnvironment: 'night-sky',
      favoriteActivity: 'falling-stars',
      recentModules: ['dreamroom', 'studio', 'soundscape'],
      theme: 'light',
    },
  ]);

  console.log('✅  Seed complete!');
  console.log('👤  Users seeded:');
  users.forEach((u) => console.log(`    ${u.name} <${u.email}> — password: password123`));

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
