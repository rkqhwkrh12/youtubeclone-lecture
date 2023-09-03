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
    //User가 이미 DB에 있다면 This username/email is already taken이 출력되게 한다.
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
        username,
        socialOnly: false //email로 로그인 했느지 안했는지를 알기 위해서
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

//github auth 설정창에서 callback url 정하는 부분에 있음.
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
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
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,  
                },
            })
        ).json();
        //console.log(userData);
        //user가 email을 보여주지 않을 때가 있음.
        //그래서 email API에게도 요청을 보내줘야함
        const emailData = await(
            await fetch(`${apiUrl}/user/emails` , {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true 
    
        );
        if(!emailObj) {
            return res.redirect("/login");
        }
        //email로 확인
        let user = await User.findOne({ email: emailObj.email });
        if(!user) {
            //User 생성
            //creat하고 ctrl+spacebar를 했을 때 목록이 나오는 이유 >> User.js에서 스키마로 데이터를 저장해 주었기 때문에(MonggoDB)
            user = await User.create({
                name:userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true, //github 로그인을 통해 만들어진 계정이란 뜻
                location: userData.location,
                avartarUrl: userData.avartarUrl,
            }); 
        }
            //로그인하고 홈으로
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        } else {
            return res.redirect("/login");
        }

};
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
};
export const postEdit = async (req, res) => {
    //edit-profile에서 입력받은 form을 이용. >> 비디오가 수정되었을 때 이를 저장되게끔 만드는 거.
    //form에서 가져오기 >>req로 가져오면 된다.
    const {
        session: {
            user: {_id, avartarUrl},
        },
        body: {
            name, email, username, location
        },
        file, //file이 undefine일수돌 잇음
    } =  req;
    //form에서 가져온 email, username과 DB에 저장된 email과 username을 비교하여 같은게 있으면 변경이 안되고
    //errorMessage가 나오게 한다.
    const currentUser = req.session.user;
    if((currentUser.email !== email) && (await User.exists({email}))){
        return res.status(400).render("edit-profile", {
            pageTitle,
            errorMessage: "This email is already taken."
        });
    }
    if((currentUser.username !== username) && (await User.exists({username}))){
        return res.status(400).render("edit-profile", {
            pageTitle,
            errorMessage: "This username is already taken."
        });
    }
    const updateUser = await User.findByIdAndUpdate(_id,
        {
            avartarUrl: file ? file.path : avartarUrl,
            name,
            email,
            username,
            location,
        },
        {new: true}
    );
    req.session.user = updateUser;
    return res.redirect("/users/edit");
};


export const getChangePassword = (req, res) => {
    //User가 로그인 되어 있을 때만 비밀번호를 변경할 수 있도록
    if(req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("users/change-password", {
        pageTitle: "Change Password"
    });
};

export const postChangePassword = async (req, res) => {
    //send notification >> change-password pug에 있는 비밀번호 변경과 관련된 form에서 값을 가져와서 코드를 작성.
    //password 변경시 고려사항 >> 현재 비번을 확인하는 코드, 바뀐 비번을 확인 후 DB에 업데이트할때 hashing할 수 있는 지.
    const {
        session :{
            user: {_id},
        },
        body: {oldPassword, newPassword, newPasswordConfirmation}
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);

    if(!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect",
        });
    }
    if(newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password", 
            errorMessage: "The password does not match the confirmation",
        });
    }
    user.password = newPassword;
    await user.save(); // >>미들웨어에서 비번이 DB에 저장되기 전에 저장하는 코드를 작성했었음.
    return res.redirect("/users/logout");
};
export const see = (req, res) => {
    return res.redirect("/");
};






