
/*
const trending = (req, res) => res.send("Home Page Videos");
const watch = (req, res) => res.send("Watch");
const edit = (req, res) => res.send("Edit");
//export를 붙임으로써 한 파일이 여러개를 익스포트 할 수 있음.
*/
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
import { async } from "regenerator-runtime";

/*Video.find().then(function (videos) {
    console.log(videos);
   }).catch(function (err) {
    console.log(err);
   });
*/  

export const home = async (req, res) => {
    const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
    return res.render("home", {pageTitle: "Home", videos}); //render()안에 pug의 파일명을 넣어준다.
   
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments"); //owner필드에 해당하는 사용자 정보를 가져오도록 populate 사용.
    //console.log(video);
    if(!video){
        return res.render("404", {pageTitle: "Video not found."});
    }
   
    return res.render("watch", {pageTitle: video.title, video});
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user:{_id},
    } = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    //video를 업로드하게 되면 비번이 또 다시 해싱돼서 나중에 로그아웃후에 다시 로그인 할 때 문제가 생김. 
    //이를 해결하기 위한 코드 >> video.owner가 가지고 있는 id와 user의 id를 이용.
    if(String(video.owner) !== String(_id)) {
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Editing: ${video.title}`, video});
};

export const postEdit = async (req, res) => {
   
    const {
        user: {_id},
    } = req.session;
    const { id } = req.params;
    const { title, description, hashtags} = req.body;
    const video = await Video.findById(_id); //대문자 Video는 model에서 가지고 온 거다ㅏ!
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
     //edit으로 페이지를 이동할 때만 hashing을 고려해야 하는게 아니고 업로드 할 때도 고려를 해줘야 함
    if(String(video.owner) !== String(_id)){
        req.flash("error", "You are not the the owner of the video.");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("success", "Changes saved.");
    return res.redirect(`/videos/${id}`);

};




export const  getupload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postupload = async (req, res) => {
    const {
        user: { _id} ,
    } = req.session;
    const { video, thumb } = req.files; //multer를 사용했을때 사용가능한거
    //post video array
    //console.log(video, thumb);
    const { title, description, hashtags} = req.body;
    //real data  >> shema랑 동일한 형태로 짠다.
    const isCould = process.env.NODE_ENV === "production";
    try{
        const newVideo = await Video.create({ //Video 모델에서 가지고 온 거
            title, // title: 5, >>요런식으로 보내줘도 mongoose가 int를 string으로 바꿔줌.
            description,
            fileUrl:isCould ? video[0].location : video[0].path,
            thumbUrl:isCould ? thumb[0].location : video[0].path ,
            //,로 구분된 hashtag들을 split함수를 써서 , 로 분리를 하고 만약#가 없는게 있다면,
            //자동으로 #를 붙여준다.
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
           
        });
        const user = await User.findById(_id);
        //user에 있는 videos 배열에 영상을 업데이트 하는데 user이므로 session id를 이용한다
        user.videos.push(newVideo._id); //배열에 푸시
        user.save() // 저장
        //console.log(video); >> real data입력이 정상적으로 이루어 지고 있는지 확인하기 위한 코드
        //const dbVideo = await video.save(); //>> save는 promise를 return 해줌. save작업이 끝날 때까지 기다려줘야함.
                                            //데이터를 database에 전송하는 데 시간이 걸리기때문에 무조건 해줘야 함.
        //console.log(dbVideo);
        return res.redirect("/"); //홈으로 돌아감.
    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error._message,});

    }
    
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: {_id},
    } = req.session;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video nmot found."});
    }
    //삭제할때도 DB가 업데이드 되니까 hash가 hash 되지 않도록 조심.
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
      }
    await Video.findByIdAndDelete(id);
    //console.log(id);
    //delete video
    return res.redirect("/");
}

//>>사용자가 검색을 했을 때만 keyword값이 출력되고 검색하지 않으면 그냥 undefined로 나온다.
export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if(keyword){
        //search
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),

            },
        }).populate("owner");
    }

    return res.render("search", {pageTitle: "Search", videos});
    
}
//조회수를 저장하기 위한 콘트롤러
export const registerView = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views+1;
    await video.save();
    return res.sendStatus(200);
};

//로그인 되었을 때 입력한 댓글을 컨트롤 하기 위한 코드
//videoId을 이용한다. >> watch.pug에서 data-id를 설정한 것처럼?
export const createComment = async (req, res) => {
    
     //comments의 model을 보고 아래와 같이 작성.
    const {
      session: { user },
      body: { text },
      params: { id },
    } = req;
    //populate 메서드를 사용하여 Video 모델의 owner 필드를 채우려고 함.
    //이는 비디오 문서에 저장된 소유자 정보를 가져와서 해당 정보를 owner 필드에 채우는 것을 나타냄
    //.populate("comments") >> Video 모델의 comments 필드를 채우려는 것으로, 해당 비디오에 연결된
    //댓글 정보를 가져와서 comments 필드에 채우는 역할을 함.
    const video = await Video.findById(id);
    if (!video) {
    //video가 없다면 에러를 출력하고 끝냄.
      return res.sendStatus(404);
    }
    const comment = await Comment.create({
      text,
      owner: user._id,
      video: id,
    });
    video.comments.push(comment._id);  // 작성한 댓글을 comments 배열에 저장하기 위함.
    video.save();
    return res.status(201).json({ newCommentId: comment._id });
};

export const deletComment = async(req, res) => {
    const {
        session: {user},
        body: {commentId},
        params: { id },
    } = req;
    const video = await Video.findById(id);

    if(!video) {
        return res.sendStatus(404);
    }

    video.comments = video.comments.filter((id) => id !== commentId);
    video.save();

    await Comment.findByIdAndDelete(commentId);

    return res.sendStatus(200);
};