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
    return [];
  }
  const formattedHashtags = hashtags
    .split(",")
    .map((word) => {
      word = word.trim(); // 입력된 문자열의 앞뒤 공백 제거
      if (word === "") {
        return null; // 빈 문자열인 경우 null 반환
      }
      if (!word.startsWith("#")) {
        word = `#${word}`; // '#'로 시작하지 않는 경우 '#' 추가
      }
      return word;
    })
    .filter((word) => word !== null); // null 필터링

  return formattedHashtags;
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
