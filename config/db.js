import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    // Set fallback DNS servers (Google / Cloudflare) to prevent local router/ISP SRV lookup failures on Windows
    dns.setServers(['8.8.8.8', '1.1.1.1']);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
