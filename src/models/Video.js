import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
    title: {type: String, required: true, trim:true, maxLength: 80 }, //{type: String}과 동일.
    description: {type: String, required: true, trim:true, minLength: 2},
    thumbUrl: { type: String, required: true },
    fileUrl: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{type: String, trim: true}],
    meta: {
        views: {type: Number, default: 0, required: true},
        
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },],
    //User에 있는 id를 이용하여 다른 문서와의 연결을 위한 코드
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
});

videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
})


const Video = mongoose.model("Video", videoSchema);
export default Video;

