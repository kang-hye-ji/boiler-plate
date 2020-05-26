import React, {useEffect} from 'react'
import axios from 'axios';

function LandingPage(){

    useEffect( ()=>{
        axios.get('/api/hello')
        .then(response=>console.log(response.data))  //서버에게 엔드포인트 'api/hello'를 보내고, 서버에서 오는 response를 콘솔창에 띄운다.
    }, [])

    return(
        <div style={{display:'flex', justifyContent:'center',alignItems:'center', 
        width:'100%', height:'100vh'}}>
            시작페이지
        </div>
    )
}

export default LandingPage