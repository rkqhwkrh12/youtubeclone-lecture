import User from "../models/User";
import bcrypt from "bcrypt";




export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "Join"});
}

export const postJoin = async (req, res) => {
    //console.log(req.body); //form에 있는 걸 불러오기 위한것
    const { name, username, email, password, password2 , location } = req.body;
    const pageTitle = "Join";
    if(password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists =  await User.exists({
        //$or 오퍼레이터를 사용하면 배열안에 있는 여러조건 중 하나만 참이여도 조절할 수 있는 것을 만들수 있음.
        $or: [{username}, {email}]
    });
    if(exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
    
    


}

export const getLogin = (req, res) => {
    return res.render("login", {pageTitle:"Login"});
}; 
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({
        username
    });
    //로그인 정보가 없으면 다시 로그인 하라고 로그인 페이지를 렌더링 해줘야함.
    if(!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exits.",
        });
    }
    //bcypt의 compare로 비교가능
    //password >> 유저가 password를 입력하는 곳, user.password는 DB에 있는 해싱된 패스워드를 불러오는 것
    const ok = await bcrypt.compare(password, user.password );
    if(!ok) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong password",
        });
    }
    //로그인 정보가 확인가능하다면
    return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User"); 
//자바스크립트 안에는 delete가 이미 지정되어 있음.

export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");

