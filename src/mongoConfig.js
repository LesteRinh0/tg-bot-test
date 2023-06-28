import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

import { key } from './src/constants.js';

mongoose.connect(key.url).then(() => console.log('Connected!'));

export const client = new MongoClient(key.url);
export const db = client.db('bot');
export const collection = db.collection('subscribers');