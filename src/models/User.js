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
  chDiscription: { type: String }, // 채널 설명
  wallPaper: { type: String }, // 채널 배경 이미지 (색상)
  joinAt: { type: Date, required: true, default: Date.now }, // 가입일

  videos: [
    //업로드한 동영상

    { type: mongoose.Schema.Types.ObjectId, require: true, ref: `Video` },
  ],
  comments: [
    // 해당 유저가 작성한 댓글
    { type: mongoose.Schema.Types.ObjectId, require: true, ref: `Comment` },
  ],
  watchedVideo: [
    //시청한 동영상
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
