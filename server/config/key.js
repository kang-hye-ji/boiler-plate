if(process.env.NODE_ENV=='production'){
    module.exports=require('./prod');
}else{
    module.exports=require('./dev');
}
//환경변수 : process.env.NODE_ENV
//dev모드에 있을 때 > 환경변수가 development
//배포 이후에는 > 환경변수가 production  이라고 나온다.