import React, {useEffect, useRef, useState} from 'react';
import {getReportsForAdmin} from "../../Requests/Requests";
import Header from "../../components/utilitis/Header/Header";
import {ButtonBase, CircularProgress} from "@material-ui/core";
import {useRouter} from "next/router";
import {AdminID} from "../../store/store";

// @ts-ignore
import moment from 'moment-jalaali'
import gsap from 'gsap'

moment.loadPersian()
const Admin = () => {

    const [currentDay, setCurrentDay] = useState("");
    const [dayData, setDayData] = useState({} as { reports: any[], sentUsers: any[], unsentUsers: any[] });

    const [reports, setReports] = useState([] as any[]);
    const [sentUsers, setSentUsers] = useState([] as any[]);
    const [unsentUsers, setUnsentUsers] = useState([] as any[]);
    const [loading, setLoading] = useState(false);

    const [dialogListData, setDialogListData] = useState([] as any[]);

    const [adminRemainingTime, setAdminRemainingTime] = useState(0);


    const unsentUsersHolderRef = useRef<HTMLDivElement>(null)
    const sentUsersHolderRef = useRef<HTMLDivElement>(null)
    const usersListRef = useRef<HTMLDivElement>(null)

    const [currentOpenDialog, setCurrentOpenDialog] = useState('');
    const router = useRouter()
    const {token} = router.query

    const reportsHolder = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (token)
            AdminID(token as string)
    }, [token]);

    useEffect(() => {

        setDialogListData([])
        if (currentDay)
            getReportsForAdmin("093845b5f724e4a047c9f2221cd903b4", currentDay, currentDay).then((e) => {
                let day = e.data[Object.keys(e.data)[0]]
                setDayData(e.data[Object.keys(e.data)[0]])
                setLoading(false)
                setAdminRemainingTime(day.remainTime)
            })
    }, [currentDay]);


    useEffect(() => {


        if (dayData) {
            if (dayData.reports) {
                setReports(dayData.reports)
            } else {
                setReports([])
            }
            if (dayData.sentUsers) {
                setSentUsers(dayData.sentUsers)
            } else {
                setSentUsers([])
            }

            if (dayData.unsentUsers) {
                setUnsentUsers(dayData.unsentUsers)

            } else {
                setUnsentUsers([])
            }


        }
    }, [dayData]);
    return (
        <div className={'bg-secondary min-h-full pb-10 relative'}>
            <Header name={'آقای یزدانی'} role={"مدیریت منابع انسانی"} setDay={(day: string) => {
                setLoading(true)
                setCurrentDay(day)
            }}/>

            {
                adminRemainingTime > 1 ?
                    <div
                        className={'w-full  pb-2 text-right text-hint-text IranSansMedium bg-background text-sm pt-2 px-3'}>
                        <span>
                                    کارمندان تا
                        </span>
                        {" "}
                        {moment.duration(adminRemainingTime ?? 0, 'seconds').humanize()}
                        {" "}
                        <span>
                                    دیگر میتوانند گزارش ثبت کنند

                        </span>
                    </div>
                    :
                    <div
                        className={'w-full  pb-2 text-right text-hint-text IranSansMedium bg-background text-sm pt-2 px-3'}>
                        <span>مهلت ثبت گزارش برای این روز به پایان رسیده است</span>

                    </div>

            }


            {
                loading ?
                    <div className={'w-full pt-10 h-full flex flex-row justify-center items-center'}>
                        <CircularProgress/>
                    </div>
                    :
                    <div>


                        <div className={' w-full pb-16 h-full flex flex-col justify-start items-center px-4 py-3  '}
                             ref={reportsHolder}>


                            {
                                reports.length ?
                                    reports.map((report, index) => {


                                        const d = new Date((report.updatedAt ?? report.createdAt) * 1000)

                                        return (

                                            <div key={'rep-' + index} style={{
                                                animationDelay: ((index + 1) * 50) + 'ms'
                                            }}
                                                 className={'each-user transition-all mt-4 animate__animated animate__fadeInUp animate__faster  bg-primary-dark rounded-2xl pb-3  w-full shadow-md'}>

                                                <div
                                                    className={' flex flex-row justify-between  items-start px-3 pt-3'}>
                                                    <div
                                                        className={'flex flex-row justify-center items-center shrink-0'}>
                                                        <div
                                                            className={'h-12 w-12 rounded-xl bg-primary overflow-hidden'}>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src="/img/no-image.png" alt="Arnoya"
                                                                 className={'w-full h-full block object-cover'}/>
                                                        </div>
                                                        <div
                                                            className={'flex h-full flex-col justify-around items-start mr-3'}>
                                            <span
                                                className={'block IranSansMedium text-sm text-white'}>{report.user.name}</span>
                                                            <span
                                                                className={'block text-text-blue-light mt-1 IranSansMedium '}
                                                                style={{
                                                                    fontSize: '0.7rem'
                                                                }}>{report.user.role}</span>
                                                        </div>
                                                    </div>


                                                    <div className={'flex flex-col justify-center items-center  '}>
                                                        <div
                                                            className={'rounded-xl border mb-2 border-deactive-border flex flex-row justify-center items-center   py-1.5  '}>
                                                            <span
                                                                className={'IranSansMedium text-primary mx-3 text-sm '}>{report.timeFields[0] ? report.timeFields[0].value : "00:00"}</span>
                                                            <img className={'ml-2 w-5'} src="/svg/work-glyph.svg"
                                                                 alt=""/>
                                                        </div>

                                                        <div
                                                            className={'rounded-xl border border-deactive-border flex flex-row justify-center items-center   py-1.5'}>
                            <span
                                className={'IranSansMedium text-primary mx-3 text-sm '}>{report.timeFields[0] ? report.timeFields[1].value : "00:00"}</span>
                                                            <img className={'ml-2 w-5'}
                                                                 src="/svg/training-glyph.svg"
                                                                 alt=""/>

                                                        </div>


                                                    </div>
                                                </div>

                                                <div
                                                    className={'w-full flex flex-col justify-start items-center px-4 transition-none report-details overflow-hidden h--0 '}
                                                    style={{
                                                        height: '0px'
                                                    }}>

                                                    {
                                                        (report.textFields as any[]).map((textField, index) => {
                                                            if (textField.value)
                                                                return (
                                                                    <div key={'e-rep' + report.userID + index}
                                                                         className={"w-full flex flex-col mt-4 justify-start items-start"}>
                                                                        <span className={'text-primary IranSansMedium '}
                                                                              style={{
                                                                                  fontSize: '0.75rem'
                                                                              }}>{textField.title}</span>
                                                                        <p className={'text-white text-justify IranSansMedium select-all mt-2'}
                                                                           style={{
                                                                               fontSize: '0.7rem'
                                                                           }}>{textField.value}</p>
                                                                    </div>

                                                                )
                                                        })
                                                    }


                                                    <div className={'h-5'}></div>

                                                </div>

                                                <div
                                                    className={'w-full h-7 flex flex-row justify-between items-end text-white IranSansMedium px-3'}>
                                                    <div className={'flex flex-row justify-center items-center  '}
                                                         onClick={(e) => {
                                                             let el = (e.currentTarget as HTMLDivElement).parentElement!.parentElement!.querySelector('.report-details')!
                                                             let arrow = e.currentTarget.querySelector('.up-arrow') ?? document.createElement('div')
                                                             let text = e.currentTarget.querySelector('.more-text') ?? document.createElement('div')
                                                             if (el.className.includes('h--0')) {
                                                                 el.className = el.className.replace("h--0", "h--auto");
                                                                 gsap.to(el, {
                                                                     height: 'auto',
                                                                     duration: '0.3'
                                                                 });
                                                                 (text as HTMLSpanElement).innerText = "پنهان کردن اطلاعات بیشتر"
                                                                 arrow.classList.add('rotate-180')
                                                             } else {
                                                                 el.className = el.className.replace("h--auto", "h--0");
                                                                 gsap.to(el, {
                                                                     height: '0px',
                                                                     duration: '0.3'
                                                                 });
                                                                 (text as HTMLSpanElement).innerText = "نمایش  اطلاعات بیشتر"
                                                                 arrow.classList.remove('rotate-180')
                                                             }


                                                         }}
                                                    >
                                                        <div
                                                            className={'w-9 h-9 border flex flex-row justify-center items-center border-deactive-border rounded-xl'}>
                                                            <img src="/svg/more-arrow.svg"
                                                                 className={'p-2 up-arrow transition-all duration-300 ease-in-out'}
                                                                 alt=""/>
                                                        </div>

                                                        <span className={'IranSansMedium text-primary  mr-2 more-text'}
                                                              style={{
                                                                  fontSize: '0.7rem'
                                                              }}>پنهان کردن اطلاعات بیشتر</span>
                                                    </div>
                                                    <span className={''} style={{
                                                        fontSize: '0.7rem'
                                                    }}>{new Intl.DateTimeFormat('fa-IR', {timeStyle: 'short'}).format(d)}</span>
                                                </div>

                                            </div>


                                        )
                                    })
                                    :
                                    null
                            }
                        </div>

                        <div
                            className={'fixed max-w-md bottom-0 left-1/2 -translate-x-1/2 w-full  h-20 flex flex-row justify-center items-center py-2'}>

                            <div ref={sentUsersHolderRef}
                                 className={' bg-primary-dark shrink-0 border-2 border-primary rounded-xl h-full flex-col justify-start items-center pt-2 px-2'}
                                 style={{
                                     width: '25%'
                                 }}
                                 onClick={(e) => {
                                     if (usersListRef.current) {
                                         usersListRef.current.style.transition = 'all .3s'
                                         usersListRef.current.style.opacity = "0"
                                         usersListRef.current.style.transition = ''

                                         usersListRef.current.style.right = (Math.abs(e.currentTarget.getBoundingClientRect().right - document.body.getBoundingClientRect().width)) + "px"
                                         usersListRef.current.style.left = ""
                                         usersListRef.current.style.transition = 'all .3s'

                                         usersListRef.current.style.opacity = "1"

                                     }

                                     if (currentOpenDialog === "sent") {
                                         setDialogListData([])
                                         setCurrentOpenDialog('')

                                     } else {
                                         setDialogListData(sentUsers)
                                         setCurrentOpenDialog('sent')

                                     }


                                 }}
                            >


                                {
                                    sentUsers.length ?

                                        <div>
                                            <div className={'flex flex-row justify-between items-center'}>
                                                <div className={'flex w-2/3 flex-row justify-center items-center'}>
                                                    <div className={'flex flex-row justify-end items-center'}
                                                         style={{
                                                             transform: `translateX(${-(sentUsers.length / 4)}rem)`
                                                         }}>

                                                        {
                                                            sentUsers.slice(0, 3).map((avatar, index) => {
                                                                return (

                                                                    <div key={index + "av"}
                                                                         className={'w-6 h-6 rounded-full bg-yellow-300  border-secondary border-2 shrink-0'}
                                                                         style={{
                                                                             transform: `translateX(${index / 1.5}rem)`
                                                                         }}/>
                                                                )


                                                            })
                                                        }


                                                    </div>


                                                </div>
                                                <div className={'rotate-180'}></div>
                                                <img src="/svg/more-arrow-blue.svg"
                                                     className={`h-5 w-5 transition-all duration-500 ease-in-out ${currentOpenDialog === 'sent' ? "" : 'rotate-180'}`}
                                                     alt=""/>
                                            </div>


                                            <span
                                                className={'IranSansMedium pt-1 text-primary  whitespace-nowrap block w-full text-center '}
                                                style={{
                                                    fontSize: '0.7rem'
                                                }}>


                                    {sentUsers.length}
                                                {" "}


                                                نفر ثبت شده</span>

                                        </div>

                                        :
                                        <div className={'w-full flex flex-col justify-center items-center'}>
                                                <span
                                                    className={'IranSansMedium text-primary text-sm whitespace-nowrap'}>تا الان گزارشی</span>
                                            <span className={'IranSansMedium text-primary text-sm'}>ثبت نشده</span>
                                        </div>

                                }


                            </div>


                            <ButtonBase
                                className={' shrink-0 mx-2 bg-primary rounded-xl h-full flex flex-row justify-center items-center  IranSansMedium text-white'}
                                style={{
                                    width: '45%'
                                }}>
                                دانـلود گـزارش
                            </ButtonBase>


                            <div ref={unsentUsersHolderRef}
                                 className={'bg-primary-dark shrink-0 border-2 border-deactive-border rounded-xl h-full flex-col justify-start items-center pt-2 px-2'}

                                 style={{
                                     width: '25%'
                                 }}
                                 onClick={(e) => {


                                     if (usersListRef.current) {
                                         usersListRef.current.style.transition = 'all .3s'
                                         usersListRef.current.style.opacity = "0"
                                         usersListRef.current.style.transition = ''

                                         usersListRef.current.style.left = (Math.abs(e.currentTarget.getBoundingClientRect().left)) + "px"
                                         usersListRef.current.style.right = ""
                                         usersListRef.current.style.transition = 'all .3s'

                                         usersListRef.current.style.opacity = "1"

                                     }


                                     if (currentOpenDialog === "unsent") {
                                         setDialogListData([])
                                         setCurrentOpenDialog('')


                                     } else {
                                         setDialogListData(unsentUsers)
                                         setCurrentOpenDialog('unsent')

                                     }


                                 }}

                            >


                                {
                                    unsentUsers.length ?
                                        <div>

                                            <div className={'flex flex-row justify-between items-center'}>
                                                <div className={'flex w-2/3 flex-row justify-center items-center'}>
                                                    <div className={'flex flex-row w-12 justify-start items-center'}
                                                         style={{
                                                             // transform: `translateX(${-(unsentUsers.length/(unsentUsers.length-1))}rem)`
                                                         }}>

                                                        {
                                                            unsentUsers.slice(0, 3).map((avatar, index) => {
                                                                return (

                                                                    <div key={index + "av"}
                                                                         className={'w-6 h-6 rounded-full bg-yellow-300  border-secondary border-2 shrink-0'}
                                                                         style={{
                                                                             transform: `translateX(${index / 1.5}rem)`
                                                                         }}/>
                                                                )


                                                            })
                                                        }


                                                    </div>


                                                </div>
                                                <img src="/svg/more-arrow.svg"
                                                     className={`h-5 w-5 transition-all duration-500 ease-in-out ${currentOpenDialog === 'unsent' ? "" : 'rotate-180'}`}
                                                     alt=""/>
                                            </div>

                                            <span
                                                className={'IranSansMedium  pt-1 text-text-blue-light  whitespace-nowrap block w-full text-center '}
                                                style={{
                                                    fontSize: '0.7rem'
                                                }}>

                                    {unsentUsers.length}

                                                {" "}

                                                نفر ثبت نشده
                                </span>

                                        </div>
                                        :
                                        <div className={'w-full flex flex-col justify-center items-center'}>
                                            <span
                                                className={'IranSansMedium text-text-blue-light text-sm'}> گزارش همه</span>
                                            <span
                                                className={'IranSansMedium text-text-blue-light text-sm'}>ثبت شده</span>
                                        </div>

                                }

                            </div>
                        </div>

                    </div>

            }


            <div
                ref={usersListRef}
                style={{
                    left: '20px'
                }}
                className={` ${dialogListData.length ? '' : 'hidden pointer-events-none'} unsent-users-list px-3 pb-2 flex flex-col justify-start items-center fixed bottom-20  border border-deactive-border backdrop-blur-2xl rounded-2xl`}>


                {dialogListData.map((item: any, index) => {

                    return (
                        <ButtonBase key={'dial' + index + item.name}
                                    style={{
                                        animationDelay: (index * 100) + 'ms'
                                    }}
                                    className={'w-full flex flex-row mt-2 border-b-4 border-white justify-start items-start animate__animated animate__fadeIn animate__faster  '}
                                    onClick={() => {
                                        if (currentOpenDialog === 'sent') {
                                            setDialogListData([])
                                            setCurrentOpenDialog("")
                                            if (reportsHolder.current) {

                                                reportsHolder.current.scrollTo(0, (reportsHolder.current.children[index] as HTMLDivElement).offsetTop)
                                            }
                                        } else {

                                        }

                                    }}
                        >
                            <img src="/img/no-image.png" className={'rounded-xl h-7 w-7'} alt=""/>
                            <span
                                className={'text-white mx-3 whitespace-nowrap IranSansMedium'}>{item.name} </span>
                        </ButtonBase>
                    )

                })}


            </div>


        </div>


    );
};

export default Admin;