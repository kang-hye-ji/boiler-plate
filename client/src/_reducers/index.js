import {combineReducers} from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})
//여러가지 REDUCERS를 rootReducer를 통해 하나로 묶어주는 것

export default rootReducer;

//reducer가 하는 일 : State의 변화를 보여주고 마지막 값을 리턴해주는 것
//User Rdducer, Number, Post, Comment, Subscribe ... 관련 Reducer가 있을 수 있음