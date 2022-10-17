import React, {MouseEvent, useEffect, useState} from 'react';
import {getUsers} from "../Requests/Requests";
import produce from "immer";

const AllUsers = () => {

    const [userList, setUserList] = useState([] as any);

    useEffect(() => {
        getUsers().then((res) => {
            try {
                setUserList(produce(draft => {
                    draft = res.data
                    return draft
                }))
            } catch (e) {

            }
            console.log(res)
        })
    }, []);

    function onUserClick(event: MouseEvent<HTMLDivElement>) {
        // window.open()
        console.log(event)
    }

    return (
        <div
            className={'w-full h-full overflow-scroll px-3 flex-col justify-start items-center snap-y snap-mandatory '}>


            <div className={'h-48    '}></div>
            {
                userList.map((user: any, index: number) => {
                    return (
                        <div key={index}
                             className={' bg-primary-dark rounded-2xl my-3 px-2 mx-auto flex flex-row justify-start items-center py-2 max-w-md shrink-0 snap-start  '}
                             onClick={onUserClick}>
                            <img src="/img/no-image.png" alt="No Image Yet" className={'h-12 w-12 rounded-2xl'}/>
                            <span className={'text-white IranSansMedium mr-2 shrink-0'}>{user.name}</span>
                            <a target={'_blank'} rel={'noreferrer'} href={'/user/' + user.id+'?noTimeLimit=true'}
                               className={'text-primary underline IranSans w-full text-left pl-2'}> لینک گزارش</a>
                        </div>
                    )

                })
            }
            <div className={'h-48    '}></div>

        </div>
    );
};

export default AllUsers;