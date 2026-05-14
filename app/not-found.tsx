import React from 'react'

const notFound = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='flex flex-col justify-center'>
            <h1 className='text-3xl font-semibold text-black/80 text-center'>Oops!</h1>
            <h1>The page you are looking for does not exist</h1>
           <a rel="stylesheet" href="/" className=' bg-black text-center text-white mt-3  rounded-2xl p-2 font-heading' >Return to home</a>
        </div>

    </div>
  )
}

export default notFound
