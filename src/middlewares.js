export const localsMiddleware = (req, res, next) => {

    //res.locals를 사용하면 pug에서 바로 사용할 수 있다. >> 개꿀임.
    res.locals.loggedIn = Boolean(req.session.loggedIn); //브라우저에 있는 로그인 정보와 DB에 저장된 로그인정보가 같다면
    res.locals.siteName ="Wetube";
    res.locals.loggedInUser = req.session.user;
    //console.log(res.locals);
    next();

}

