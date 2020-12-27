import React, {useState} from 'react'
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function LoginPage(props){
    const dispatch = useDispatch();
    
    const [Email, setEmail] = useState("")  
    //react에서 hook state을 만들 때 > useState라고 치기
    //useState (initialState) > initialState : 처음에 state가 어떻게 되는가
    const [Password, setPassword] = useState("")  // state = input의 value
    //서버에 보내고자 하는 값을 state이 가지고 있다.

    const onEmailHandler=(event)=>{
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler=(event)=>{
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler=(event)=>{
        event.preventDefault();  // 버튼을 눌렀을 때 refresh되는 것을 방지한다.

        let body={
            email:Email,
            password:Password
        }

        dispatch(loginUser(body))     //로그인하면 LandingPage로 돌아가도록 함, props 인자를 loginfunction 인자로 넣어줄 것
            .then(reponse=> {
                if(reponse.payload.loginSuccess){
                    props.history.push('/')
                }else{
                    alert('Error')
                }
            })

        
    }

    return(
        <div style={{display:'flex', justifyContent:'center',alignItems:'center', 
        width:'100%', height:'100vh'}}>
            
            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <br/>
                <button type="submit">Login</button>
            </form>

        </div>
    )
}

export default withRouter(LoginPage)