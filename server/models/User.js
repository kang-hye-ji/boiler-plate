const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt= require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

userSchema.pre('save',function( next ){
    var user=this; //this란 userSchema를 말함. 위에 있는 묶음들.

    if (user.isModified('password')){   //email만 바꾸면 암호화되지 않고.. password를 바꿀때만!
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err) //만약 에러가 발생 > next(save단계)의 err로 간다.
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                // 비밀번호 데이터베이스에 hash를 저장한다.
                // hash가 암호화된 비밀번호임
                if(err) return next(err)
                user.password=hash
                //유저의 비밀번호를 hash된 비밀번호로 바꿔주는 것이다.
                next()
                //모두 마친 후 next로 돌아감.
            });
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword,cb){
    //plainPassword 1234567   암호화된 비밀번호 ???????
    //plain도 암호화해서, DB에 있는 암호화 같은지 확인해야 한다.
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch);
    })
}

userSchema.methods.generateToken=function(cb){
    var user=this;
    //jsonwebtoken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // 'secretToken' -> user._id
    user.token=token   //토큰을 생성해서 user에 넣어준 것.
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)  // null = err가 없음
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user=this;

    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 후에
        //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token":token}, function(err, user){
            if (err) return cb(err);
            cb(null, user)
        })
    });
}

const User=mongoose.model('User',userSchema)

module.exports = {User}