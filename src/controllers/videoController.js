
/*
const trending = (req, res) => res.send("Home Page Videos");
const watch = (req, res) => res.send("Watch");
const edit = (req, res) => res.send("Edit");
//export를 붙임으로써 한 파일이 여러개를 익스포트 할 수 있음.
*/
export const trending = (req, res) => res.send("Home Page Videos");
export const see = (req, res) => {
    return res.send(`Watch Video #${req.params.id}`);
};
export const edit = (req, res) => {
    return res.send("Edit");
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
    return res.send("Delete Video");
};