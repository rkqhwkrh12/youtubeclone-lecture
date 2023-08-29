
/*
const trending = (req, res) => res.send("Home Page Videos");
const watch = (req, res) => res.send("Watch");
const edit = (req, res) => res.send("Edit");
//export를 붙임으로써 한 파일이 여러개를 익스포트 할 수 있음.
*/
import Video from "../models/Video";

/*Video.find().then(function (videos) {
    console.log(videos);
   }).catch(function (err) {
    console.log(err);
   });
*/  

export const home = async (req, res) => {
    const videos = await Video.find({});
 
    return res.render("home", {pageTitle: "Home", videos}); //render()안에 pug의 파일명을 넣어준다.
   
};
export const watch = (req, res) => {
    const { id } = req.params;

    return res.render("watch", {pageTitle: `Watching`});
};
export const getEdit = (req, res) => {
    const { id } = req.params;

    return res.render("edit", {pageTitle: `Editing:`});
};
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } =  req.body;
    return res.redirect(`/videos/${id}`);
};
export const search = (req, res) => res.send("Search");

export const deleteVideo = (req, res) => {
    return res.send("Delete Video");
};

export const  getupload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postupload = async (req, res) => {
    //post video array
    const { title, description, hashtags} = req.body;
    //real data  >> shema랑 동일한 형태로 짠다.
    try{
        await Video.create({ //Video 모델에서 가지고 온 거
            title, // title: 5, >>요런식으로 보내줘도 mongoose가 int를 string으로 바꿔줌.
            description,
   
            //,로 구분된 hashtag들을 split함수를 써서 , 로 분리를 하고 만약#가 없는게 있다면,
            //자동으로 #를 붙여준다.
            hashtags: hashtags.split(",").map((word) => `#${word}`),
           
        });
        //console.log(video); >> real data입력이 정상적으로 이루어 지고 있는지 확인하기 위한 코드
        //const dbVideo = await video.save(); //>> save는 promise를 return 해줌. save작업이 끝날 때까지 기다려줘야함.
                                            //데이터를 database에 전송하는 데 시간이 걸리기때문에 무조건 해줘야 함.
        //console.log(dbVideo);
        return res.redirect("/"); //홈으로 돌아감.
    } catch {
       
        return res.render("upload", {pageTitle: "Upload Video", errorMessage: error._message});

    }
    
}
