import mongoose from "mongoose";

type ConnectionObjectProp = {
  isConnected?: number;
};

const connection: ConnectionObjectProp = {};

export async function connectDb() {
  try {
    if (connection.isConnected) {
      console.log("DataBase alreadyconnected");
    }
    const res = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = res.connections[0].readyState;
    console.log("MongoDb Conneted ");
  } catch (error) {
    console.log("MongoDbConnection Error while Connecting", error);
    process.exit(1);
  }
}
