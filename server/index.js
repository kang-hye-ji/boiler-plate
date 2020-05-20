const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser=require('cookie-parser');

const config = require('./config/key');

const {auth}=require('./middleware/auth')
const {User} = require("./models/User");


app.use(bodyParser.urlencoded({extended:true}));
//application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있도록 한다.
app.use(bodyParser.json());
//application/json타입으로 된 것을 분석해서 가져올 수 있도록 한다.
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect( config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 새해복 많이 받으세요'))


app.get('/api/hello', (req,res)=>{
    res.send("안녕하세요~")
})


//아래는 회원가입(register)을 위한 router
app.post('/api/users/register',(req, res) => {
    //회원가입할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body)
    //user 정보를 req.body에 들어갈 수 있도록 해준다. 이는 body-parser가 있어서 가능한거다.

    user.save((err, userInfo)=>{
        if(err) return res.json({success:false, err})
        //에러가 있을 경우, json 형식으로 성공하지 못했다고 클라이언트에게 전달해준다.
        //에러메세지도 함께 준다.
        return res.status(200).json({
            success:true
        })
        //status(200) 은 성공했다는 표시다.
    })
    //위 user는 몽고db에서 온 것
})

// 로그인을 위한
app.post('/api/users/login', (req, res) => {
    //요청된 이메일(아이디)을 데이터베이스에 있는지 찾는다.
    User.findOne({email:req.body.email},(err,user) => {   //findOne : mongoDB에서 제공하는 method
        if(!user){
            return res.json({
                loginSuccess:false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
        //요청된 이메일(아이디)이 있다면 > 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password , (err,isMatch)=>{
            if(!isMatch)
                return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
            
            //비밀번호까지 맞다면 토큰 생성
            user.generateToken((err,user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다.  어디에?  > 쿠키, 로컬스토리지 등.. (개발자 툴, application에서 확인가능)
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess:true, userId:user._id})
            })
        })
    })
})

//엔드포인트에서 request를 받은 후에 > 미들웨어(중간에서 뭘 해주는 것) > 콜백function(req,res)을 함. 
app.get('/api/users/auth', auth, (req,res)=>{
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id:req.user._id,   // ./middleware/auth.js 에서 req.user=user 했기 때문에 가능한 것
        isAdmiin: req.user.role === 0 ? false : true,   //관리자인가? : role이 0이면 false, 아니면 true
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })
})

app.get('/api/users/logout', auth, (req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},   //미들웨어 auth에서 user._id를 가져와 찾는다.
    {token:""},   // : 두번째 object / 토큰을 지워준다.
    (err,user)=>{
        if(err) return res.json({success:false, err});
        return res.status(200).send({
            success:true
        })
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))