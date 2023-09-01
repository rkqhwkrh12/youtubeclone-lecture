import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";




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
    //로그인이 됐는지 안됐는 지를 확인하기 위해서 req로 loggedIn을 DB에 삽입.
    req.session.loggedIn = true;
    req.session.user = user;
    //로그인 정보가 확인가능하다면
    return res.redirect("/");
};


export const startGithubLogin = (req, res) =>{
    //login.pug에 있는 너무 긴 URL을 쪼개서 관리하기 편하게 만들기 위해서 다음과 같은 코드 작성.
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString(); //congif에 있는 것들을 모두 합쳐 최종 Url을 만들어줌.
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};
export const finishGithubLogin = async(req, res) => {
    const baseUrl = "POST https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT ,
        client_secret: process.env.GH_SECRETE ,
        code : req.query.code,  //로그인 버튼 클릭시에 생성됨.(Continue to Github)
    };
    const params = new URLSearchParams(config).toString(); //>>Url 생성
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest =  await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();
    //access_token이 들어있다면
    if("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const userRequest = await (
            await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        console.log(userRequest);

    } else{
        return res.redirect("/login");
    }
 


};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User"); 
//자바스크립트 안에는 delete가 이미 지정되어 있음.

export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");

