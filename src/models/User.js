import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  defaultAvartar: { type: Boolean, default: true },
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  location: { type: String },
  videos: [
    { type: mongoose.Schema.Types.ObjectId, require: true, ref: `Video` },
  ],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, require: true, ref: `Comment` },
  ],
  watchVideo: [
    {
      video: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: `Video`,
      },
      time: { type: Date, required: true },
    },
  ],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
