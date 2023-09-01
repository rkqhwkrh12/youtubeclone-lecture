import User from "../models/User";



export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "Join"});
}

export const postJoin = async (req, res) => {
    //console.log(req.body); //form에 있는 걸 불러오기 위한것
    const { name, username, email, password, location } = req.body;
    await User.create({
        name,
        username,
        email,
        password,
        location,
    });
    
    return res.redirect("/login");
}


export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User"); 
//자바스크립트 안에는 delete가 이미 지정되어 있음.
export const login = (req, res) =>  res.send("Login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");