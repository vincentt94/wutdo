import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user';
import Note from '../models/note';
dotenv.config();
async function clearDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wutdoDB');
        console.log('Connected to MongoDB.');
        const userCount = await User.countDocuments();
        const noteCount = await Note.countDocuments();
        if (userCount === 0 && noteCount === 0) {
            console.log('No data to delete. Database is already clean.');
        }
        else {
            await User.deleteMany({});
            await Note.deleteMany({});
            console.log(` Deleted ${userCount} user(s) and ${noteCount} note(s).`);
        }
    }
    catch (err) {
        console.error(' Failed to clear database:', err);
    }
    finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB.');
    }
}
clearDatabase();
