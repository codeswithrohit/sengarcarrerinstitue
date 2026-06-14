import React from 'react'
import Course1 from "@/components/sections/Course1";
const courses = ({courses,loading}) => {
  return (
    <>
    {loading ? (
        <Preloader />
      ) : (
    <div>
 <Course1 courses={courses} />
    </div>
)}
</>
  )
}

export default courses
