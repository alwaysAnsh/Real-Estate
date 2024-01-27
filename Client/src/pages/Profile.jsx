import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice'

const Profile = () => {

  const {currentUser} = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file,setFile] = useState(undefined)
  const [filePercentage, setFilePercentage ] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData ] = useState({})
  const dispatch = useDispatch();


  // console.log('logging the file',file)
  // console.log("file percentage completed : ", filePercentage)
  // console.log("formdata is : ", formData)

  /***********************************ONCHANGE EVENT DEFINED ************************ */
  const handleOnChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });

  }

  /*****************************USE EFFECT HOOK*********************************** */

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file])

   /********************************FILE UPLOAD ******************************** */

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file)
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
      // console.log('upload is ' + progress + '% done ');
      setFilePercentage(Math.round(progress))
    },
    (error) => {
      setFileUploadError(true)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setFormData({ ...formData, avatar: downloadUrl})
      })
    }
    )

  }
  /********************************FILE UPLOAD FUNCTION FINISHED******************************** */

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log("update button cliked!!")
    console.log("id of user is : ", currentUser.rest._id);
    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser.rest._id} `,{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json()

      if(data.success === false){
        dispatch(updateFailure(data.message))
        return;
      }
      dispatch(updateSuccess(data))

    } catch (error) {
      dispatch(updateFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl font-bold text-center my-7' >Profile</h1>

      {/* ********************************FORM IS HERE******************************** */}

      <form   onSubmit={handleOnSubmit} className='flex flex-col gap-4' >
        <input  onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img  onClick={() => fileRef.current.click()} src={ formData.avatar || currentUser.avatar} alt="ProfileImg" className=' self-center border-2 rounded-full h-24 w-24 object-cover cursor-pointer ' />
        <p>
          {
            fileUploadError ? (<span className='text-red-700 ' >Error Image Upload (image must be less than 2 mb)</span> ) : filePercentage > 0 && filePercentage < 100 ? (<span className='text-slate-700' >{`Uploading ${filePercentage}%` }</span>) : filePercentage === 100 ? (
              <span className='text-green-700 text-center' >Uploaded Succesfully </span>) : ("")
            
          }
        </p>
        <input 
        type="text"
        placeholder='username'
        defaultValue={currentUser.username}
        id='username'
        className='border p-3 rounded-lg'
        onChange = {handleOnChange} />
        
        <input 
        type="email"
        placeholder='email'
        defaultValue={currentUser.email}
        id='email'
        className='border p-3 rounded-lg'
        onChange = {handleOnChange} />
        <input 
        type="password"
        placeholder='password'
        id='password'
        className='border p-3 rounded-lg'
        onChange = {handleOnChange} />
        
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80' >Update</button>
        
      </form>


      <div className='flex justify-between mt-5' >
        <span className='text-red-500 cursor-pointer' >Delete account</span>
        <span className='text-red-500 cursor-pointer' >Sign Out</span>
      </div>
    </div>
  )
}

export default Profile