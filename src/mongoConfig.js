import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

import { keys } from './constants.js';

mongoose.connect(keys.url).then(() => console.log('Connected!'));

export const client = new MongoClient(keys.url);
export const db = client.db('bot');
export const collection = db.collection('subscribers');