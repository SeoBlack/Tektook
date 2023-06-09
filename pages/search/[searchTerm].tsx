import React,{useState} from 'react'
import Image from 'next/image'
import { GoVerified } from 'react-icons/go'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import VideoCard from '../../components/VideoCard'
import NoResults from '../../components/NoResults'
import {IUser, Video} from '../../types'
import { BASE_URL } from '../../utils'
import { useAuthStore } from '../../store/authStore'
const Search = ({ videos }: { videos:Video[]}) => {
    const [isAccounts,setIsAccounts] = useState(true)
    const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400';
    const isVideos = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400';
    const { allUsers } = useAuthStore()
    const router = useRouter()
    const { searchTerm } : any = router.query
    const searchedUsers = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  return (
    <div className='w-full '>
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full ">
            <p className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`} onClick={() => setIsAccounts(true)}>Accounts</p>
            <p className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`} onClick={() => setIsAccounts(false)}>Videos</p>
        </div>
        {isAccounts ? (
            <div className='md:mt-10 '>
                {searchedUsers.length > 0 ? (
                    searchedUsers.map((user:IUser,idx:number) => (
                        <Link href={`/profile/${user._id}`} key={idx}>
                            <div className='flex p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200 gap-3'>
                                <div >
                                <Image
                                    src={user.image}
                                    alt={user.userName}
                                    width={50}
                                    height={50}
                                    className='rounded-full'
                                />
                                </div>
                                <div className="xl:block">
                                <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                                    {user.userName} 
                                    { user.userName === "Sorin" && <GoVerified className='text-blue-400'/> }
                                </p>
                                <p className='capitalize text-gray-400 text-xs'>
                                    {user.userName}
                                </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : <NoResults text={`User ${searchTerm} doesn't exist`}/>}
            </div>
        ) : (
            <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
                {videos.length > 0 ? (
                    videos.map((video: Video,idx:number) => (
                        <VideoCard post={video} key={idx}/>
                    ))
                ) : <NoResults text={`No Video Results For ${searchTerm}`}/> }
            </div>
        )}
    </div>
  )
}
export const getServerSideProps = async ( {params: { searchTerm }} : { params : { searchTerm : string}}) => {
    const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)
    return {
        props: { videos: res.data}
    }
}

export default Search
