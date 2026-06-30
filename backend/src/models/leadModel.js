import mongoose  from "mongoose";

const leadSchema= new mongoose.Schema(
    {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
},
{timestamps:true}
);
export default mongoose.model("lead",leadSchema)