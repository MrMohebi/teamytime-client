import React, {useEffect, useRef, useState} from 'react';
import {getAdminById, getCompany, getReportsForAdmin} from "../../Requests/Requests";
import Header from "../../components/utilitis/Header/Header";
import {Button, ButtonBase, CircularProgress} from "@material-ui/core";
import {useRouter} from "next/router";
import {AdminID, BaseURL, CompanyId, CompanyName, CurrentDay} from "../../store/store";
// @ts-ignore
import $ from 'jquery'
// @ts-ignore
import moment from 'moment-jalaali'
import gsap from 'gsap'
import {useSwipeable} from "react-swipeable";
import {useReactiveVar} from "@apollo/client";
import {fullDate} from "../../helpers/FullDate";
import AdminNoReports from "../../components/DayFragments/AdminNoReports";
import VerifyReportDialog from "../../components/VerifyReportDialog/VerifyReportDialog";
import produce from 'immer'
import {IMGURL} from "../../helpers/IMGURL";

moment.loadPersian()
const Admin = () => {

    const [currentDay, setCurrentDay] = useState("");
    const [dayData, setDayData] = useState({} as { reports: any[], sentUsers: any[], unsentUsers: any[] });

    const [reports, setReports] = useState([] as any[]);
    const [sentUsers, setSentUsers] = useState([] as any[]);
    const [unsentUsers, setUnsentUsers] = useState([] as any[]);
    const [loading, setLoading] = useState(true);
    const [reportsLoading, setReportsLoading] = useState(false);

    const [dialogListData, setDialogListData] = useState([] as any[]);

    const [admin, setAdmin] = useState({
        name: '',
        role: '',
        token: '',
        id: ""
    });

    const [adminRemainingTime, setAdminRemainingTime] = useState(0);


    const unsentUsersHolderRef = useRef<HTMLDivElement>(null)
    const sentUsersHolderRef = useRef<HTMLDivElement>(null)
    const usersListRef = useRef<HTMLDivElement>(null)
    const defaultColorIndicatorHeight = '50%'

    const currentDayReactive = useReactiveVar(CurrentDay)
    const [currentOpenDialog, setCurrentOpenDialog] = useState('');

    const [currentUserData, setCurrentUserData] = useState({
        name: "",
        role: '',
        jalaliDate: '',
        userID: "",
        workingHours: "00:00",
        trainingHours: "00:00",
        currentReportAdminReview: ([] as any)
    });

    const [showVerifyDialog, setShowVerifyDialog] = useState(false);
    const router = useRouter()
    const {id} = router.query

    const reportsHolder = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (admin.token) {
            AdminID(admin.token)
            setAdmin(produce(draft => {
                draft.id = id as string
            }))

        }
    }, [admin]);

    //get admin
    useEffect(() => {

        if (id)
            getAdminById((id as any)).then((value) => {
                if (value.data.token) {
                    try {
                        setAdmin(
                            produce(draft => {
                                draft.name = value.data.name;
                                draft.role = value.data.role;
                                draft.token = value.data.token;
                            })
                        )
                    } catch (e) {

                    }
                }
            })
    }, [id]);


    useEffect(() => {
        if (admin.token)
            fetchDay()

    }, [currentDay, admin]);


    const fetchDay = () => {
        setDialogListData([])
        setCurrentOpenDialog('')
        setReportsLoading(true)
        if (currentDay)
            getReportsForAdmin(admin.token, currentDay, currentDay).then((e) => {
                let day = e.data[Object.keys(e.data)[0]]
                setDayData(e.data[Object.keys(e.data)[0]])

                setReportsLoading(true)

                setReportsLoading(false)
                setAdminRemainingTime(day.remainTime)


                let children = document.querySelectorAll('.header-day')
                if (!CurrentDay())
                    children.forEach((item) => {
                        if (item.querySelector('.date-of-day')!.innerHTML === fullDate(0)) {
                            CurrentDay(item.id)
                            // GoToThisDay(children[childIndex].id)
                        }

                    })

            })
    }
    useEffect(() => {
        let day = currentDay;
        if (CurrentDay())
            if (document.getElementById(CurrentDay()))
                document.getElementById(CurrentDay())!.childNodes.forEach((child) => {
                    if ((child as HTMLDivElement).classList.contains('date-of-day'))
                        day = (child as HTMLDivElement).innerText

                })
        setCurrentDay(day)
        setLoading(false)
    }, [currentDayReactive]);
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


    useEffect(() => {
        // console.log(location.hostname)
        // const urlSplitArray = document.baseURI.split('.unimun')
        // let companyName;
        //
        // companyName = urlSplitArray[0]
        // companyName = companyName.replace('http://', '')
        // companyName = companyName.replace('https://', '')
        // if ((companyName as string).includes('/'))
        //     companyName = 'arnoya'
        //
        // CompanyName(companyName)
        // console.log(companyName)
        // console.log('comp name split')


        let companyName = "";
        if (CompanyName())
            companyName = CompanyName()
        else
            companyName = location.hostname.split('.')[0]

        CompanyName(companyName)


        getCompany(companyName).then((value) => {
            try {
                CompanyId(value.data.id)
            } catch (e) {

            }
        })
    }, []);

    const isThisReportEmpty = (report: any) => {


        let textFieldsValues = [] as string[];
        if (report.textFields) {
            Object.keys(report.textFields).forEach((key) => {
                let data = report.textFields[key].value
                if (data) {
                    textFieldsValues.push(data)
                }
            })
        }


        return !textFieldsValues.length;

    }
    const allowToSwipe = useRef(true)

    const handlers = useSwipeable({

        onTouchStartOrOnMouseDown: ({event}) => {
            console.log(event)
            console.log(event.target)

        },

        onSwipedRight: () => {
            let nextID = 'd-' + (parseInt(CurrentDay().split('-')[1]) + 1)


            if ((document.getElementById(nextID))) {
                CurrentDay(nextID)
                //
                //
                // document.getElementById('d-scroller')!.scrollBy(-(document.getElementById('d-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
                // document.getElementById('reports-scroller')!.scrollBy(-(document.getElementById('reports-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
            }
        },
        onSwipedLeft: () => {


            let nextID = 'd-' + (parseInt(CurrentDay().split('-')[1]) - 1)

            if ((document.getElementById(nextID))) {
                CurrentDay(nextID)
                //
                //
                // document.getElementById('d-scroller')!.scrollBy(-(document.getElementById('d-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
                // document.getElementById('reports-scroller')!.scrollBy(-(document.getElementById('reports-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
            }

            if ((document.getElementById('d-scroller'))) {
                // document.getElementById('d-scroller')!.scrollBy((document.getElementById('d-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
                // document.getElementById('reports-scroller')!.scrollBy((document.getElementById('reports-scroller')!.childNodes[1] as HTMLDivElement).getBoundingClientRect().width, 0)
            }
        },
    });

    return (
        <div className={'bg-secondary min-h-full  pb-10 relative'}>
            {/* @ts-ignore*/}
            <VerifyReportDialog adminID={id}
                                currentReportAdminReview={currentUserData.currentReportAdminReview}
                                adminName={admin.name}
                                jalaliDate={currentUserData.jalaliDate}
                                show={showVerifyDialog}
                                onClose={(adminReviewObj: any) => {

                                    if (adminReviewObj)
                                        setReports(
                                            produce(draft => {
                                                draft.filter((item) => {
                                                    return item.userID === currentUserData.userID
                                                })[0].adminReview = adminReviewObj
                                            })
                                        )
                                    // fetchDay()
                                    setShowVerifyDialog(false)
                                }} userID={currentUserData.userID} workingHours={currentUserData.workingHours}
                                trainingHours={currentUserData.trainingHours} name={currentUserData.name}
                                role={currentUserData.role}/>

            <div className={'h-20 text-white w-full bg-red mt-32 contents pointer-events-auto'}>


                <Header admin={true} loading={loading} name={admin.name} role={admin.role}
                        setDay={(day: string) => {
                            setReportsLoading(true)
                            setCurrentDay(day)
                        }}/>

                {
                    reports.length ?
                        adminRemainingTime > 1 ?
                            <div
                                className={'w-full pb-2 text-right text-hint-text IranSansMedium bg-background text-sm pt-2 px-3'}>
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

                        :
                        null

                }


                {
                    reportsLoading ?
                        <div className={'w-full pt-10 h-full flex flex-row justify-center items-center'}>
                            <CircularProgress/>
                        </div>
                        :
                        <div>


                            <div
                                className={' w-full pb-16 h-full  flex flex-col justify-start items-center px-4 py-3  '}
                                ref={reportsHolder}>


                                {
                                    reports.length ? reports.map((report, index) => {

                                            const d = new Date((report.updatedAt ?? report.createdAt) * 1000)


                                            let reportState = "";
                                            let adminReview = [] as any;

                                            try {
                                                reportState = report.adminReview[0].state
                                                adminReview = report.adminReview

                                            } catch (e) {

                                            }

                                            return (

                                                <div key={'rep-' + index} style={{
                                                    animationDelay: ((index + 1) * 50) + 'ms'
                                                }}
                                                     className={'each-user overflow-hidden relative transition-all mt-4 animate__animated animate__fadeInUp animate__faster  bg-primary-dark rounded-2xl pb-3  w-full shadow-md'}>

                                                    <div style={{
                                                        height: defaultColorIndicatorHeight
                                                    }}
                                                         className={`color-indicator absolute right-0 top-1/2 -translate-y-1/2 ${reportState === 'verified' ? "bg-primary" : reportState === "warning" ? 'bg-red' : reportState === 'improvement' ? "bg-green" : 'bg-gray-600'}  w-1 rounded-tl-xl rounded-bl-xl`}></div>
                                                    <div
                                                        className={' flex flex-row justify-between  items-start px-3 pt-3'}>
                                                        <div
                                                            className={'flex flex-row justify-center items-center shrink-0'}>
                                                            <div
                                                                className={'h-12 w-12 rounded-xl bg-primary overflow-hidden'}>
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={`${report.user.profile ? IMGURL(report.user.profile) : "/img/no-image.png"} `}
                                                                    alt="Arnoya"
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


                                                        <div
                                                            className={'flex flex-col justify-center items-center  '}>
                                                            <div
                                                                className={'rounded-xl border mb-2 border-inactive-border flex flex-row justify-center items-center   py-1.5  '}>
                                                            <span
                                                                className={'IranSansMedium text-primary mx-3 text-sm '}>{report.timeFields[0] ? report.timeFields[0].value : "00:00"}</span>
                                                                <img className={'ml-2 w-5'}
                                                                     src="/svg/work-glyph.svg"
                                                                     alt=""/>
                                                            </div>

                                                            <div
                                                                className={'rounded-xl border border-inactive-border flex flex-row justify-center items-center   py-1.5'}>
                                                                <span
                                                                    className={'IranSansMedium text-primary mx-3 text-sm '}>{report.timeFields[0] ? report.timeFields[1].value : "00:00"}</span>
                                                                <img className={'ml-2 w-5'}
                                                                     src="/svg/training-glyph.svg"
                                                                     alt=""/>

                                                            </div>


                                                        </div>
                                                    </div>

                                                    <div
                                                        data-has-reports={isThisReportEmpty(report)}
                                                        className={'w-full flex flex-col justify-start items-center px-4 transition-none report-details overflow-hidden h--0 '}
                                                        style={{
                                                            height: '0px'
                                                        }}>


                                                        {
                                                            (report.textFields as any[]).map((textField, index) => {
                                                                if (textField.value)
                                                                    return (
                                                                        <div
                                                                            key={'e-rep' + report.userID + index}
                                                                            className={"w-full flex flex-col mt-4 justify-start items-start"}>
                                                                        <span className={'text-primary IranSansMedium '}
                                                                              style={{
                                                                                  fontSize: '0.75rem'
                                                                              }}>{textField.title}</span>
                                                                            <p className={'text-white text-justify IranSansMedium select-all mt-2 whitespace-pre-line'}
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
                                                        className={'w-full flex flex-row justify-between items-end text-white IranSansMedium px-3 shrink-0'}>
                                                        <div
                                                            className={'flex flex-row justify-start items-center w-[75%]'}>

                                                            {!isThisReportEmpty(report) ?
                                                                <div
                                                                    className={'flex flex-row justify-center items-center  '}
                                                                    onClick={(e) => {
                                                                        let el = (e.currentTarget as HTMLDivElement).parentElement!.parentElement!.parentElement!.querySelector('.report-details')!
                                                                        let arrow = e.currentTarget.querySelector('.up-arrow') ?? document.createElement('div')
                                                                        let text = e.currentTarget.querySelector('.more-text') ?? document.createElement('div')
                                                                        let verifyReportButton = e.currentTarget.parentElement!.parentElement!.querySelector('.verify-btn') ?? document.createElement('div')

                                                                        if (el.className.includes('h--0')) {
                                                                            el.className = el.className.replace("h--0", "h--auto");
                                                                            gsap.to(el, {
                                                                                height: 'auto',
                                                                                duration: '0.3'
                                                                            });
                                                                            gsap.to(verifyReportButton, {
                                                                                opacity: '1',
                                                                                pointerEvents: 'auto',
                                                                                duration: '0'
                                                                            });
                                                                            gsap.to(text, {
                                                                                width: '0px',
                                                                                pointerEvents: 'none',
                                                                                duration: '0'
                                                                            });

                                                                            if ((el.parentElement!.querySelector('.color-indicator'))) {
                                                                                gsap.to((el.parentElement!.querySelector('.color-indicator')), {
                                                                                    height: "70%",
                                                                                    duration: '0.3'
                                                                                });

                                                                            }

                                                                            arrow.classList.add('rotate-180')


                                                                        } else {
                                                                            el.className = el.className.replace("h--auto", "h--0");
                                                                            gsap.to(el, {
                                                                                height: '0px',
                                                                                duration: '0.3'
                                                                            });
                                                                            gsap.to(text, {
                                                                                width: 'auto',
                                                                                pointerEvents: 'auto',
                                                                                duration: '0',
                                                                                overflow: 'hidden'
                                                                            });
                                                                            gsap.to(verifyReportButton, {
                                                                                opacity: '0',
                                                                                pointerEvents: 'none',
                                                                                duration: '0'
                                                                            });
                                                                            if ((el.parentElement!.querySelector('.color-indicator'))) {
                                                                                gsap.to((el.parentElement!.querySelector('.color-indicator')), {
                                                                                    height: defaultColorIndicatorHeight,
                                                                                    duration: '0.3'
                                                                                });
                                                                            }


                                                                            arrow.classList.remove('rotate-180')
                                                                        }


                                                                    }}
                                                                >
                                                                    <div
                                                                        className={'w-9 h-9 border flex flex-row justify-center items-center border-inactive-border rounded-xl shrink-0'}>
                                                                        <img src="/svg/more-arrow.svg"
                                                                             className={'p-2 up-arrow transition-all duration-300 ease-in-out'}
                                                                             alt=""/>
                                                                    </div>


                                                                    <span
                                                                        className={'IranSansMedium text-primary whitespace-nowrap mr-2 more-text overflow-hidden'}
                                                                        style={{
                                                                            fontSize: '0.7rem'
                                                                        }}>نمایش  اطلاعات بیشتر</span>
                                                                </div>
                                                                :
                                                                <div></div>
                                                            }


                                                            {
                                                                adminReview.length ?


                                                                    <div
                                                                        className={' verify-btn hide-scrollbar overflow-x-hidden relative shrink-0 w-full '}
                                                                        onPointerMove={(e) => {
                                                                            e.stopPropagation()
                                                                        }}
                                                                        style={{
                                                                            pointerEvents: 'none',
                                                                            opacity: '0'
                                                                        }}
                                                                    >
                                                                        <div className={'absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-primary-dark to-transparent z-10'}></div>
                                                                        <div className={'absolute right-0 top-0 h-full w-2 bg-gradient-to-l from-primary-dark to-transparent z-10'}></div>
                                                                        <div
                                                                            className={'flex flex-row justify-start items-center w-full h-full overflow-x-scroll overflow-y-visible px-4'}>

                                                                            <Button style={{}}
                                                                                    onClick={() => {
                                                                                        setCurrentUserData(
                                                                                            produce((draft) => {
                                                                                                draft.userID = report.userID;
                                                                                                draft.jalaliDate = report.jalaliDate;
                                                                                                draft.workingHours = report.timeFields[0] ? report.timeFields[0].value : "00:00"
                                                                                                draft.trainingHours = report.timeFields[1] ? report.timeFields[1].value : "00:00"
                                                                                                draft.name = report.user.name
                                                                                                draft.role = report.user.role
                                                                                                draft.currentReportAdminReview = adminReview
                                                                                            })
                                                                                        )
                                                                                        setShowVerifyDialog(true)

                                                                                    }}
                                                                                    className={'border-solid verify-btn mx-1 shrink-0 border border-primary rounded-xl text-primary px-4 '}>
                                                                    <span
                                                                        className={'IranSansMedium whitespace-nowrap'}>
                                                                        {
                                                                            report.adminReview && (report.adminReview as [any]).filter((item) => {
                                                                                return item.adminId === admin.id
                                                                            }).length ?
                                                                                "تغیر نظر" :
                                                                                "ثبت نظر"
                                                                        }
                                                                    </span>
                                                                            </Button>

                                                                            {
                                                                                adminReview.map((item: any, index: any) => {

                                                                                    return (
                                                                                        <Button key={index}

                                                                                                className={`border-solid shrink-0 mx-1 flex flex-row justify-center items-center  mr-1 border ${item.state === 'verified' ? "border-primary text-primary" : item.state === "warning" ? 'border-red text-red' : item.state === 'improvement' ? "border-green text-green" : 'border-gray-600'} border-primary rounded-xl text-primary px-4 `}>
                                                                    <span className={'IranSansMedium text-inherit'}>
{
    item.name
}
                                                                    </span>
                                                                                            {/*{*/}
                                                                                            {/*    admin.id === item.adminId ?*/}
                                                                                            {/*        <img*/}
                                                                                            {/*            src={("/svg/") + (item.state === 'verified' ? "edit-blue" : item.state === "warning" ? 'edit-red' : item.state === 'improvement' ? "edit-green" : 'bg-gray-600') + '.svg'}*/}
                                                                                            {/*            className={'h-5 w-5 mr-2'}*/}
                                                                                            {/*            alt="edit report"/>*/}
                                                                                            {/*        :*/}
                                                                                            {/*        null*/}
                                                                                            {/*}*/}

                                                                                        </Button>
                                                                                    )
                                                                                })
                                                                            }


                                                                        </div>


                                                                    </div>

                                                                    :
                                                                    <Button style={{
                                                                        pointerEvents: 'none',
                                                                        opacity: '0'
                                                                    }}
                                                                            onClick={() => {
                                                                                setCurrentUserData(
                                                                                    produce((draft) => {
                                                                                        draft.userID = report.userID;
                                                                                        draft.jalaliDate = report.jalaliDate;
                                                                                        draft.workingHours = report.timeFields[0] ? report.timeFields[0].value : "00:00"
                                                                                        draft.trainingHours = report.timeFields[1] ? report.timeFields[1].value : "00:00"
                                                                                        draft.name = report.user.name
                                                                                        draft.role = report.user.role
                                                                                    })
                                                                                )
                                                                                setShowVerifyDialog(true)


                                                                            }}
                                                                            className={'border-solid verify-btn mr-1 border border-primary rounded-xl text-primary px-4 '}>
                                                                    <span className={'IranSansMedium'}>
                                                                                            تایید گزارش

                                                                    </span>
                                                                    </Button>
                                                            }


                                                        </div>


                                                        <span className={'shrink-0'} style={{
                                                            fontSize: '0.7rem'
                                                        }}>{new Intl.DateTimeFormat('fa-IR', {timeStyle: 'short'}).format(d)}</span>
                                                    </div>


                                                </div>


                                            )
                                        })
                                        :
                                        <AdminNoReports/>
                                }
                            </div>

                            {reports.length ?
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
                                                 // setDialogListData([])
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
                                                        <div
                                                            className={`flex w-2/3 flex-row justify-center items-center ${currentOpenDialog === 'sent' ? 'avatars-opened' : 'avatars-closed'}`}>
                                                            <div
                                                                className={'flex flex-row w-12 justify-start items-center'}
                                                                style={{
                                                                    // transform: `translateX(${-(sentUsers.length / 4)}rem)`
                                                                }}>

                                                                {
                                                                    sentUsers.slice(0, 3).map((avatar, index) => {
                                                                        return (

                                                                            <img alt={'avatar'}
                                                                                 src={avatar.profile ? IMGURL(avatar.profile) : '/img/no-image.png'}
                                                                                 key={index + "av"}
                                                                                 className={'w-6 h-6 rounded-full object-fill shrink-0'}
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
                                                    <span
                                                        className={'IranSansMedium text-primary text-sm'}>ثبت نشده</span>
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
                                         className={'bg-primary-dark shrink-0 border-2 border-inactive-border rounded-xl h-full flex-col justify-start items-center pt-2 px-2'}

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
                                                 // setTimeout(()=>{
                                                 //     setDialogListData([])
                                                 // },)
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
                                                        <div
                                                            className={`flex w-2/3 flex-row justify-center items-center  ${currentOpenDialog === 'unsent' ? 'avatars-opened' : 'avatars-closed '} `}>
                                                            <div
                                                                className={'flex flex-row w-12 justify-start items-center '}
                                                                style={{
                                                                    // transform: `translateX(${-(unsentUsers.length/(unsentUsers.length-1))}rem)`
                                                                }}>

                                                                {
                                                                    unsentUsers.slice(0, 3).map((avatar, index) => {
                                                                        return (

                                                                            <img alt={'no-image'}
                                                                                 src={'/img/no-image.png'}
                                                                                 key={index + "av"}
                                                                                 className={'w-6 h-6 rounded-full object-center border-secondary border-2 shrink-0'}
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
                                :
                                null
                            }

                        </div>

                }


                <div
                    ref={usersListRef}
                    style={{
                        left: '20px'
                    }}
                    className={` ${currentOpenDialog ? ' animate__faster opacity-100 translate-y-0' : ' pointer-events-none animate__faster opacity-0 translate-y-10'} max-h-[13rem] hide-scrollbar  transition-all ease-in-out duration-300 users-list  overflow-scroll flex flex-col justify-start items-center fixed bottom-20  border border-inactive-border backdrop-blur-2xl rounded-2xl`}>


                    {dialogListData.map((item: any, index) => {

                        return (
                            <ButtonBase key={'dial' + index + item.name}
                                        style={{
                                            animationDelay: (index * 100) + 'ms'
                                        }}
                                        className={'w-full flex flex-row h-10 shrink-0 flex flex-row justify-start px-2 items-center border-b-4 border-white justify-start items-start   '}
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
                                <img src={item.profile ? BaseURL() + item.profile : "/img/no-image.png"}
                                     className={'rounded-xl h-7 w-7'} alt=""/>
                                <span
                                    className={'text-white mx-3 whitespace-nowrap IranSansMedium'}>{item.name} </span>
                            </ButtonBase>
                        )

                    })}


                </div>

            </div>

        </div>


    );
};

export default Admin;