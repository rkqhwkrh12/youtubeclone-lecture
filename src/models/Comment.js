import mongoose from "mongoose";

//댓글과 관련된 스키마 설정.
// 1. text 내용
// 2. owner  댓글을 단 사람이 누군지 
// 3. video 댓글은 어떤 비디오안에서 달거니까 video도 추가
// 4. createdAt 댓글은 다는 시간이 언제 인지.
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});


const Comment = mongoose.model("Comment", commentSchema);

export default Comment;