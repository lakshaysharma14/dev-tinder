const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User" // reference to User Collection
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User" // reference to User Collection
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
    },
      required: true,
    },
  },
  { timestamps: true }
);

//compund index on first and lastname
connectionRequestSchema.index({firstName:1,lasName:1}); 

// Pre-Save Check
connectionRequestSchema.pre("save",function(next){
    const connectionReq = this;

    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error('Invalid connection request. Cannot Send connection request to yourself');
    }
    next();
})

const connectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequest;
