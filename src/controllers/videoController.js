
/*
const trending = (req, res) => res.send("Home Page Videos");
const watch = (req, res) => res.send("Watch");
const edit = (req, res) => res.send("Edit");
//export를 붙임으로써 한 파일이 여러개를 익스포트 할 수 있음.
*/


let videos = [
    {
        title: "First Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 1,
        id: 1,
    },
    {
        title: "Second Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 2,
    },
    {
        title: "Third Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 3,
    },
    
];

export const trending = (req, res) => {
    res.render("home", {pageTitle: "Home", potato: "potato",videos}) //render()안에 pug의 파일명을 넣어준다.
};
export const watch = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1]
    return res.render("watch", {pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1]
    return res.render("edit", {pageTitle: `Editing: ${video.title}`, video});
};
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } =  req.body;
    videos[id - 1].title = title;
    return res.redirect(`/videos/${id}`);
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
    return res.send("Delete Video");
};
