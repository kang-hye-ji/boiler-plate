import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null){
    //SpecificComponent : Auth( LandingPage ) / auth에 감싸진 특정 컴포넌트
    
    //option의 종류 : null, true, false..
    //null : 아무나 출입이 가능한 페이지
    //true : 로그인한 유저만 출입이 가능한 페이지
    //false : 로그인 한 유저는 출입 불가능한 페이지

    //adminRoute = null  : 아무것도 안쓰면 기본값이 null이라는 뜻(ES6 문법) / admin페이지일 경우 true라고 쓰면 됨
    
    function AuthenticationCheck(props){

        const dispatch=useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response=>{   //페이지가 이동할 때마다 dispatch가 작동해서 backend에 계속 request를 주고 있음
                console.log(response)

                //로그인하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){  //if (option)  =  if (option === true) = 로그인한 유저 페이지
                        props.history.push('/login')
                    }
                }else{
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdimin){  //admin인 페이지에 adimin이 아닌 계정이 들어가려고 할 때
                        props.history.push('/')
                    }else{
                        if(option === false){   //로그인유저가 출입불가한 페이지에 들어가려고 할 때
                            props.history.push('/')
                        }
                    }
                }
            })
        }, [])

        return(
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}