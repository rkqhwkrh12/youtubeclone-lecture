import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required: true, trim:true, maxLength: 80 }, //{type: String}과 동일.
    description: {type: String, required: true, trim:true, minLength: 20},
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{type: String, trim: true}],
    meta: {
        views: {type: Number, default: 0, required: true},
        rating: {type: Number, default: 0, required: true},
    },

});

//middleware는 무조건 model이 생성되기 전에 만들어야 한다.
videoSchema.pre("save", async function () {
    this.hashtags = this.hashtags[0].split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
})

const Video = mongoose.model("Video", videoSchema);
export default Video;

