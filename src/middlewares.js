export const localsMiddleware = (req, res, next) => {

    //res.locals를 사용하면 pug에서 바로 사용할 수 있다. >> 개꿀임.
    res.locals.loggedIn = Boolean(req.session.loggedIn); //브라우저에 있는 로그인 정보와 DB에 저장된 로그인정보가 같다면
    res.locals.siteName ="Wetube";
    res.locals.loggedInUser = req.session.user || {}; //user가 null 값 일수도 있음. 
    //console.log(res.locals); 
    next();

}

//loggedIn 되었을 때만 비디오 수정가능하게 하는 코드
//login이 되고 난 이후의 상황
export const protectorMiddleware = (req, res, next) => {
    //로그인되어 있을 때만 다음작업이 수행되게 하는 코드
    if(req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/login");
    }
};

//rootRouter에서 로그인을 구별하기 위해 사용
export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }
};