import Note from "../models/note.js";
import User from "../models/user.js";
import { signToken } from '../utils/auth.js';
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
const resolvers = {
    Query: {
        hello: async () => {
            return "Hello World";
        },
        getNotes: async () => {
            const notes = await Note.find().sort({ createdAt: -1 }).lean();
            // return await Story.find().sort({ createdAt: -1 });
            // Populate the username by looking up the userId in the User model
            const populatedNotes = await Promise.all(notes.map(async (note) => {
                const user = await User.findById(note.userId);
                return {
                    ...notes,
                    username: user ? user.username : "Unknown", // If user is not found, return "Unknown"
                };
            }));
            return populatedNotes;
        },
        getUserNotes: async (_, __, context) => {
            return await Note.find({ userId: context.user._id }).sort({ createdAt: -1 });
        },
        getUsers: async () => {
            return await User.find().sort({ createdAt: -1 });
        },
    },
    Upload: GraphQLUpload,
    Mutation: {
        uploadImage: async (_, { file }) => {
            // Ensure file is correctly received
            if (!file) {
                throw new Error("No file received.");
            }
            const { createReadStream } = await file;
            const stream = createReadStream();
            const uploadResult = await new Promise((resolve, reject) => {
                const cloudStream = cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                    if (error)
                        reject(error);
                    resolve(result);
                });
                stream.pipe(cloudStream);
            });
            return uploadResult.secure_url; // Return Cloudinary image URL
        },
        addUser: async (_, { input }) => {
            const hashedPassword = await bcrypt.hash(input.password, 10);
            const newUser = await User.create({
                username: input.username,
                email: input.email,
                password: hashedPassword
            });
            const token = signToken(newUser.username, newUser._id);
            return { token, user: newUser };
        },
        addNote: async (_, { title, note, imageUrl }, context) => {
            console.log("saving note - Image URL:", imageUrl); // debugging 
            const newNote = new Note({ title, note, imageUrl, userId: context.user._id });
            await newNote.save();
            return newNote;
        },
        login: async (_, { input }) => {
            const user = await User.findOne({ email: input.email });
            if (!user) {
                throw new Error("No user found with this email address.");
            }
            const validPassword = await bcrypt.compare(input.password, user.password);
            if (!validPassword) {
                throw new Error("Incorrect password.");
            }
            const token = signToken(user.username, user._id);
            return { token, user };
        }
    }
};
export default resolvers;
