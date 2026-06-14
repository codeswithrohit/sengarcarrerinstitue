import React from 'react'
import { useRouter } from 'next/router';
const subjects = () => {
    const router = useRouter();
    const { courseId } = router.query;
  return (
    <div>subjects</div>
  )
}

export default subjects