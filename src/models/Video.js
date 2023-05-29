import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 1 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, require: true, ref: "Comment" },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, require: true, ref: `User` },
  fileUrl: { type: String, require: true },
  thumbUrl: { type: String, require: true },
});

videoSchema.static("formatHashtags", function (hashtags) {
  if (hashtags.trim() === "") {
    return "";
  }
  return hashtags
    .split(",")
    .map((word) => (word.startsWith(`#`) ? word : `#${word}`));
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
