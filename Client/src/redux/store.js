import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../redux/user/userSlice.js'


export default configureStore({
  reducer: {user: userReducer} ,
})