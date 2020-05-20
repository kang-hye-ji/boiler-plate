const {User} = require('../models/User')

let auth=(req,res,next)=>{
    //인증 처리를 하는 곳

    //클라이언트 쿠키에서 token을 가져온다.
    let token=req.cookies.x_auth;

    //토큰을 복호화(decode)한 후 유저를 찾는다.
    User.findByToken(token, (err,user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth:false, error:true})

        req.token=token;
        req.user=user;  //index.js에서 token과 user정보를 사용할 수 있도록 선언해 준것이다.
        next();  //미들웨어 auth에서 넘어가도록 한다.
    })

    //유저가 있으면 인증 O

    //유저가 없으면 인증 X
}

module.exports = {auth};