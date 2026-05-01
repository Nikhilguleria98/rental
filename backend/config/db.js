import mongoose from 'mongoose';

const mongoDb = async()=>{
    try {
        console.log('🔌 Connecting to MongoDB...');
        console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
            minPoolSize: 0,
            maxPoolSize: 10,
        });

        console.log("✅ Connected to MongoDB successfully");

    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.error("Full error:", error);
        throw error; // Re-throw so the caller knows it failed
    }
}

export default mongoDb