import React, {useEffect, useRef, useState} from 'react';

import {useDebouncedCallback} from "use-debounce";
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import gsap from 'gsap'
import {
    AdminID,
    BaseURL,
    CollapseHeader,
    CoolDown,
    CurrentDay,
    CurrentSelectedDate,
    UserId
} from "../../../store/store";
import {getReportsForAdmin, getUserReportsRange} from "../../../Requests/Requests";
import {useReactiveVar} from "@apollo/client";
// @ts-ignore
import moment from 'moment-jalaali'
import {CircularProgress} from "@material-ui/core";
// @ts-ignore
import $ from 'jquery'
import {GoToThisDay} from "../../GoToThis";
import {GetDayNumberByID} from "../../../helpers/GetDayNumberByID";
import {fullDate} from "../../../helpers/FullDate";


gsap.registerPlugin(ScrollTrigger)
export const backDaysLimit = 7;
export const backDaysLimitAdmin = 20;


const Header = (props: {
        setDay: Function,
        name?: string,
        role?: string,
        profileURL?: string,
        loading?: boolean
        admin?: boolean,
        adminToken?: string


    }) => {


        const indicatorRef = useRef(null)
        const scrollerRef = useRef<HTMLDivElement>(null)
        const [currentDay, setCurrentDay] = useState("");
        const [currentMonth, setCurrentMonth] = useState("");

        const reactiveCurrentDay = useReactiveVar(CurrentDay)
        const reactiveCollapseHeader = useReactiveVar(CollapseHeader)

        const [todayID, setTodayID] = useState("");

        const [goToPosition, setGoToPosition] = useState('');

        const [indicatorColorClass, setIndicatorColorClass] = useState("bg-primary");

        const adminId = useReactiveVar(AdminID)

        const [localDays, setLocalDays] = useState([]);


        useEffect(() => {

            props.setDay(currentDay)
            CurrentSelectedDate(currentDay)
        }, [currentDay])


        useEffect(() => {

            if (reactiveCollapseHeader) {

            }
        }, [reactiveCollapseHeader]);
        useEffect(() => {

            CurrentSelectedDate(fullDate(0))

            setCurrentMonth(getMonthNameFromNow(0));


        }, [])

        useEffect(() => {

            if (!props.loading)
                setTimeout(() => {
                    scrollToToday()

                }, 300)


        }, [props.loading]);


        useEffect(() => {

                if (props.admin) {
                    GoToThisDay(CurrentDay())
                }

                let monthOfDay = currentMonth;
                if (document.getElementById(CurrentDay()))
                    if (document.getElementById(CurrentDay())) {
                        if (document.getElementById(CurrentDay())!.getElementsByClassName('date-of-day')) {
                            try {
                                console.log()

                                if (document.getElementById(CurrentDay())!.getElementsByClassName('date-of-day')[0].innerHTML === fullDate(0)) {
                                    setGoToPosition('')
                                }
                            } catch (e) {
                            }
                        }
                        document.getElementById(CurrentDay())!.childNodes.forEach((child) => {
                            if ((child as HTMLDivElement).classList.contains('month-of-day')) {
                                monthOfDay = (child as HTMLDivElement).innerText
                            }
                        })
                    }

                setCurrentMonth(monthOfDay)


                if (todayID) {
                    if (GetDayNumberByID(reactiveCurrentDay) < GetDayNumberByID(todayID) - 2) {
                        setGoToPosition('left')
                    } else if (GetDayNumberByID(reactiveCurrentDay) > GetDayNumberByID(todayID) + 2) {
                        setGoToPosition('right')
                    } else {
                        setGoToPosition('')

                    }


                }
            }
            ,
            [reactiveCurrentDay]
        )
        ;
        useEffect(() => {


            if (adminId && localDays.length < 1) {
                getReportsForAdmin(adminId, fullDate(-backDaysLimitAdmin), fullDate(backDaysLimitAdmin)).then((res) => {
                        if (res.data) {
                            let datesArr = [] as any;

                            Object.keys(res.data).forEach((date, index) => {
                                datesArr.push(res.data[date])
                            })
                            setLocalDays(datesArr)
                        }


                    }
                )
            }
        }, [adminId]);

        useEffect(() => {

            if (UserId() && localDays.length < 1) {
                getUserReportsRange(UserId(), fullDate(-backDaysLimit), fullDate(backDaysLimit)).then((res) => {
                    if (res.data) {
                        let datesArr = [] as any;

                        Object.keys(res.data).forEach((date) => {
                            datesArr.push(res.data[date])
                        })
                        setLocalDays(datesArr)
                    }


                })
            }
        }, [UserId()]);


        const getDayNameFromNow = (dayOffset: number) => {
            const d = new Date()
            d.setDate(d.getDate() + dayOffset)

            let daysE = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let days = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

            let dayName = days[d.getDay()];
            return dayName
        }

        const getFullDateFromNow = (dayOffset: number) => {
            const d = new Date()
            d.setDate(d.getDate() + dayOffset)
            return (new Intl.DateTimeFormat('fa-IR', {
                dateStyle: 'full'
            }).format(d))
        }
        const getDayDateFromNow = (dayOffset: number) => {
            const d = new Date()
            d.setDate(d.getDate() + dayOffset)
            return (new Intl.DateTimeFormat('fa-IR', {
                day: 'numeric'
            }).format(d))
        }

        const getMonthNameFromNow = (monthOffset: number) => {
            const d = new Date()
            d.setDate(d.getDate() + monthOffset)
            return (new Intl.DateTimeFormat('fa-IR', {
                month: 'long'
            }).format(d))
        }
        const getYearFromNow = (yearOffset: number) => {
            const d = new Date()
            d.setDate(d.getDate() + yearOffset)

            return (new Intl.DateTimeFormat('fa-IR', {
                year: 'numeric'
            }).format(d))
        }

        const debouncedScrollHandler = useDebouncedCallback(
            (e) => {


                try {


                    let elChildren = (e.target as HTMLDivElement).querySelectorAll('.header-day')
                    let eachChild = (e.target as HTMLDivElement).querySelector('.header-day')


                    let eachChildW = eachChild!.getBoundingClientRect().width;

                    let indicatorW = (indicatorRef.current ?? document.createElement('div') as HTMLDivElement).getBoundingClientRect().width;

                    let middleOfIndicator = (indicatorRef.current ?? document.createElement('div') as HTMLDivElement).getBoundingClientRect().x + indicatorW / 2;


                    elChildren.forEach((item, index) => {


                        let middleOfTheChild = Math.floor(item.getBoundingClientRect().left + (eachChildW / 2));


                        if (Math.abs(middleOfTheChild - middleOfIndicator) < 10) {


                        }
                    })

                } catch (e) {

                }


            },

            100
        )


        const scrollToToday = () => {
            if (scrollerRef.current) {
                let children = scrollerRef.current.querySelectorAll('.header-day')
                children.forEach((item, childIndex) => {
                    if (item.querySelector('.date-of-day')!.innerHTML === fullDate(0)) {
                        CurrentDay(item.id)
                        setTodayID(item.id)
                        // GoToThisDay(children[childIndex].id)
                    }

                })


            }


        }


        //gsap stuff


        const debouncedGsapScroll = useDebouncedCallback((index, el) => {
                setCurrentDay(el.querySelector('.date-of-day').innerHTML)
                let m = moment(fullDate(0), 'jYYYY/jMM/jDD')
                let ma = moment(el.querySelector('.date-of-day').innerHTML, 'jYYYY/jM/jD')


                if (fullDate(0) !== el.querySelector('.date-of-day').innerHTML) {
                    if (m.isAfter(ma)) {
                        setGoToPosition('left')

                    } else {
                        setGoToPosition('right')
                    }
                } else {
                    setGoToPosition('')
                }

                if (el.querySelector('.date-of-day')!.innerHTML === fullDate(0)) {
                    setGoToPosition('')
                }


                let monthOfDay = "";
                try {
                    monthOfDay = ((el.querySelector('.month-of-day')) as HTMLDivElement).innerHTML

                } catch (e) {

                }

                if (currentMonth !== monthOfDay)
                    setCurrentMonth(monthOfDay)


                if (document.querySelector("#reports-scroller"))
                    document.querySelector("#reports-scroller")!.scrollTo((document.querySelector('#reports-scroller')!.childNodes[index] as HTMLDivElement).offsetLeft, 0)


            }, 100
        )


        const due = useDebouncedCallback(() => {

            if (scrollerRef.current)
                scrollerRef.current.childNodes.forEach((child, index) => {
                    if ((child as HTMLDivElement).classList.contains('header-day')) {

                        if (index === 8)
                            debouncedGsapScroll(index, child)

                        // gsap.to(child, {
                        //
                        //     onComplete: (e) => {
                        //
                        //         debouncedGsapScroll(index, child)
                        //
                        //     },
                        //     onReverseComplete: () => {
                        //         if (scrollerRef.current)
                        //             debouncedGsapScroll(index + 1, scrollerRef.current.childNodes[index + 1])
                        //
                        //     },
                        //
                        //     scrollTrigger: {
                        //         scroller: '#d-scroller',
                        //         trigger: child as any,
                        //         start: 'top center',
                        //         end: '20px center',
                        //         horizontal: true,
                        //         // markers: true,
                        //         scrub: true
                        //     }
                        // })
                    }

                })
        }, 1000)


        useEffect(() => {
            due()
        }, [localDays]);


        // const goToThisDay = (id) => {
        //
        //     const scroller = $('#d-scroller')[0]
        //     console.log(scroller)
        //     if (scroller) {
        //         try {
        //             let halfSpace = scroller.getBoundingClientRect().width / 2
        //             let rest = 0;
        //             scroller.scrollTo(0, 0)
        //
        //             scroller.querySelectorAll('.header-day').forEach((item, childIndex) => {
        //
        //
        //                 if (id === 'd-' + childIndex) {
        //
        //                     let childrenLength = Array.from(scroller!.querySelectorAll('.header-day')).slice(0, childIndex).length
        //                     childrenLength *= item.getBoundingClientRect().width
        //                     rest = childrenLength
        //                     rest += item.getBoundingClientRect().width / 2
        //                 }
        //
        //             })
        //
        //             scrollerRef.current.scrollTo(-(rest + halfSpace), 0)
        //
        //
        //         } catch (e) {
        //
        //         }
        //
        //
        //     }
        //
        // }


        return (
            <div
                className={`w-full transition-all ease-in-out duration-500 bg-primary-dark top-0 left-0  z-30 ${reactiveCollapseHeader ? '-mt-20' : "-mt-0"}`}
                style={{
                    boxShadow: '0 11px 11px #151e27'
                }}>

                {
                    <div
                        className={`${props.loading ? 'opacity-100' : 'opacity-0 pointer-events-none'} delay-1000 transition-all duration-500 bg-background fixed top-0 left-0 z-50 w-full h-full  w-full flex flex-col justify-center items-center`}>
                        <CircularProgress size={50}/>
                    </div>

                }

                <div className={'w-full flex flex-row justify-between items-center px-5 pt-4'}>

                    <div className={'flex flex-row justify-center items-center'}>
                        <div className={'h-14 w-14 rounded-xl bg-primary overflow-hidden'}>
                            <img src={`${props.profileURL ? BaseURL() + props.profileURL : " /img/no-image.png"}`}
                                 alt="Arnoya"
                                 className={'w-full h-full block object-cover'}/>
                        </div>
                        <div className={'flex h-full flex-col justify-around items-start mr-3'}>
                            <span className={'block IranSansMedium text-md text-white'}>{props.name ?? ""}</span>
                            <span
                                className={'block text-text-blue-light mt-1 IranSansMedium text-sm'}
                                style={{}}>{props.role ?? ""}</span>
                        </div>
                    </div>

                    <div className={'h-10 w-10 rounded-xl shadow-md p-1 '}>
                        <img alt={'edit-user'} src={'/svg/userEdit.svg'} className={'h-full w-full relative p-1'}/>
                    </div>
                </div>

                {/*    date*/}


                <div className={'w-full flex flex-row justify-between items-center pt-3 px-4'}>
                    <div className={'flex flex-row justify-center items-center'}>
                        <img className={'w-9 ml-2'} src="/svg/day-navigating-arrows.svg" alt=""/>
                        <span className={'text-primary IranSans pt-0.5'} style={{
                            fontSize: '0.8rem'
                        }}>جابجایی بین روز ها</span>
                    </div>
                    <span dir={'ltr'}
                          className={'IranSansMedium text-xl text-white'}>{getYearFromNow(0) + " " + currentMonth}</span>
                </div>

                {/*    day scroller*/}

                <div className={'relative w-full mt-1'}>

                    <div style={{
                        background: 'rgba(104,180,235,0.6)'
                    }} onClick={() => {
                        scrollToToday()
                    }}
                         className={`flex absolute backdrop-blur-lg scale-75 text-white py-2 px-3 rounded-3xl z-20 top-1/2 -translate-y-1/2 ${!goToPosition ? 'hidden' : ''} ${goToPosition === "left" ? "flex-row-reverse left-0" : 'flex-row'}  justify-between items-center`}>
                        <img className={`${goToPosition === 'left' ? 'rotate-180' : ''}`} src="/svg/right-arro.svg"
                             alt=""/>
                        <span className={'IranSansMedium'}>برو به امروز</span>
                    </div>
                    <div className={'w-full h-full  absolute z-10 top-0 left-0  pointer-events-none'} style={{
                        background: "linear-gradient(to RIGHT, #202E3B -15%, transparent 46%), linear-gradient(to left, #202E3B -15%, transparent 55%)"
                    }}
                    >
                    </div>


                    <div dir={'ltr'} id={'d-scroller'} onScroll={(e) => {

                        debouncedScrollHandler(e)
                    }}
                         className={'w-full pointer-events-none flex flex-row-reverse relative items-center flex-1 flex-grow snap-x snap-mandatory overflow-x-scroll relative hide-scrollbar scroll-smooth'}
                         ref={scrollerRef}>


                        <div id={'header-scroll-space-1'} className={'w-full shrink-0'}></div>


                        {

                            localDays.map((item: any, indx) => {

                                let date = new Date()
                                date.setDate(date.getDate()) + indx


                                let index = props.admin ? (indx - backDaysLimitAdmin) : (indx - backDaysLimit)


                                return (
                                    <div key={index}

                                         onClick={(e) => {
                                             CurrentDay(e.currentTarget.id)
                                         }}
                                         id={'d-' + indx}
                                         className={'pointer-events-auto w-16 relative transition-all duration-300 ease-in-out header-day shrink-0 pt-1.5  h-18 snap-center flex flex-col justify-start items-center text-text-blue-light '}>
                                    <span className={'hidden month-of-day'}
                                          id={'month-' + index}>{getFullDateFromNow(index).split(',')[0].split(' ')[1]}</span>
                                        <span className={'hidden date-of-day'}
                                              id={'date-' + fullDate(index)}>{fullDate(index)}</span>

                                        <span className={"IranSans text-sm "}>{getDayNameFromNow(index)}</span>

                                        {fullDate(index) === fullDate(0) ?
                                            <div className={'w-2.5 h-2.5  mt-0.5'}><img src="/svg/down-arrow.svg"
                                                                                        className={'object-contain w-full h-full'}
                                                                                        alt="Today"/></div>
                                            :
                                            <div className={'w-2.5 h-2.5 mt-0.5'}></div>
                                        }
                                        <span className={"IranSans text-white text-lg "}>
                                                                            {getDayDateFromNow(index)}

                                    </span>
                                        {
                                            adminId ?
                                                <div
                                                    className={`absolute day-indicator transition-all ease-in-out duration-500 w-3/12 left-1/2 bottom-0 -translate-x-1/2 h-1 rounded-tl-lg rounded-tr-lg   `}
                                                />
                                                :
                                                <div
                                                    className={`absolute day-indicator transition-all ease-in-out duration-500 w-3/12 left-1/2 bottom-0 -translate-x-1/2 h-1 rounded-tl-lg rounded-tr-lg ${item.createdAt ? 'bg-primary' : ''} ${!item.createdAt && !item.canEdit ? 'bg-red' : ''}    `}
                                                />
                                        }

                                    </div>
                                )
                            })
                        }

                        <div className={'w-full shrink-0'}></div>


                    </div>
                    {
                        localDays.length ?
                            <div ref={indicatorRef}
                                 className={`absolute transition-all ease-in-out left-1/2 -translate-x-1/2 bottom-0 rounded-tl-lg  z-10 rounded-tr-lg h-1 w-12 ${adminId ? "bg-primary" : ""} ${indicatorColorClass}  `}></div>
                            :
                            null
                    }


                </div>

            </div>
        )
            ;
    }
;

export default Header;