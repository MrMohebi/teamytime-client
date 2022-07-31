import React, {useEffect, useState} from 'react';
import {getReportsForAdmin, getUserReports} from "../../Requests/Requests";
import {UserId} from "../../store/store";
import Header from "../../components/utilitis/Header/Header";
import {ButtonBase} from "@material-ui/core";


const Admin = () => {

    const [currentDay, setCurrentDay] = useState("");
    const [dayData, setDayData] = useState({} as {reports:any[],sentUsers:any[],unsentUsers:any[]});

    const [reports, setReports] = useState([] as any[]);
    const [sentUsers, setSentUsers] = useState([] as any[]);
    const [unsentUsers, setUnsentUsers] = useState([] as any[]);

    useEffect(() => {
        if (currentDay)

            getReportsForAdmin("093845b5f724e4a047c9f2221cd903b4", currentDay, currentDay).then((e) => {
                setDayData(e.data[Object.keys(e.data)[0]])
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
        <div className={'bg-secondary min-h-full pb-10'}>
            <Header name={'آقای یزدانی'} role={"مدیریت منابع انسانی"} setDay={(day: string) => {
                setCurrentDay(day)
            }}/>

            <div
                className={'w-full  pb-2 text-right text-hint-text IranSansMedium bg-background text-sm pt-2 px-3'}>
                کارمندان تا 2 ساعت و 20 دقیقه دیگر میتوانند گزارش ثبت کنند {" "}
                {/*{moment.duration(remainSeconds ?? 0, 'seconds').humanize()}*/}
                {" "}
            </div>


            <div className={' w-full h-full flex flex-col justify-start items-center px-4 py-3 '}>


                {
                    reports.length ?
                        reports.map((report, index) => {
                            return (

                                <div key={'rep-' + index}
                                     className={'each-user bg-primary-dark rounded-2xl pb-3  w-full shadow-md'}>

                                    <div className={' flex flex-row justify-between  items-start px-3 pt-3'}>
                                        <div className={'flex flex-row justify-center items-center shrink-0'}>
                                            <div className={'h-12 w-12 rounded-xl bg-primary overflow-hidden'}>
                                                <img src="/img/no-image.png" alt="Arnoya"
                                                     className={'w-full h-full block object-cover'}/>
                                            </div>
                                            <div className={'flex h-full flex-col justify-around items-start mr-3'}>
                                            <span
                                                className={'block IranSansMedium text-sm text-white'}>{report.user.name}</span>
                                                <span
                                                    className={'block text-text-blue-light mt-1 IranSansMedium '} style={{
                                                        fontSize:'0.7rem'
                                                }}>{report.user.role}</span>
                                            </div>
                                        </div>


                                        <div className={'flex flex-col justify-center items-center  '}>
                                            <div
                                                className={'rounded-xl border mb-2 border-deactive-border flex flex-row justify-center items-center   py-1.5  '}>
                                                {/*todo change the index to text*/}
                                                <span
                                                    className={'IranSansMedium text-primary mx-3 text-sm '}>{report.timeFields[0] ? report.timeFields[0].value : "00:00"}</span>
                                                <img className={'ml-2 w-5'} src="/svg/work-glyph.svg" alt=""/>
                                            </div>

                                            <div
                                                className={'rounded-xl border border-deactive-border flex flex-row justify-center items-center   py-1.5'}>
                            <span
                                className={'IranSansMedium text-primary mx-3 text-sm '}>{report.timeFields[0] ? report.timeFields[1].value : "00:00"}</span>
                                                <img className={'ml-2 w-5'} src="/svg/training-glyph.svg" alt=""/>

                                            </div>


                                        </div>
                                    </div>

                                    <div className={'w-full flex flex-col justify-start items-center'}></div>

                                    <div
                                        className={'w-full h-7 flex flex-row justify-between items-end text-white IranSansMedium px-3'}>
                                        <div className={'flex flex-row justify-center items-center  '}>
                                            <div
                                                className={'w-9 h-9 border flex flex-row justify-center items-center border-deactive-border rounded-xl'}>
                                                <img src="/svg/more-arrow.svg" className={'p-2'} alt=""/>
                                            </div>

                                            <span className={'IranSansMedium text-primary  mr-2'} style={{
                                                fontSize:'0.7rem'
                                            }}>پنهان کردن اطلاعات بیشتر</span>
                                        </div>
                                        <span className={''} style={{
                                            fontSize:'0.7rem'
                                        }}>12:13</span>
                                    </div>

                                </div>


                            )
                        })
                        :
                        null
                }

            </div>

            <div className={'fixed bottom-0 w-full h-20 flex flex-row justify-center items-center p-2'}>

                <div
                    className={'w-26 shrink-0 border-2 border-primary rounded-xl h-full flex-col justify-start items-center pt-2 px-2'}>

                    <div className={'flex flex-row justify-between items-center'}>
                        <div className={'flex w-2/3 flex-row justify-center items-center'}>
                            <div className={'flex flex-row justify-end items-center'} style={{
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
                        <img src="/svg/more-arrow-BLUE.svg" className={'h-5 w-5 rotate-180'} alt=""/>
                    </div>

                    <span
                        className={'IranSansMedium pt-1 text-primary  whitespace-nowrap block w-full text-center '} style={{
                        fontSize:'0.7rem'
                    }}>


                        {sentUsers.length}
                        {" "}


                        نفر ثبت شده</span>
                </div>


                <ButtonBase
                    className={'w-48 shrink-0 mx-2 bg-primary rounded-xl h-full flex flex-row justify-center items-center  IranSansMedium text-white'}>
                    دانـلود گـزارش
                </ButtonBase>


                <div
                    className={' w-26 shrink-0 border-2 border-deactive-border rounded-xl h-full flex-col justify-start items-center pt-2 px-2'}>

                    <div className={'flex flex-row justify-between items-center'}>
                        <div className={'flex w-2/3 flex-row justify-center items-center'}>
                            <div className={'flex flex-row w-12 justify-start items-center'} style={{
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
                        <img src="/svg/more-arrow.svg" className={'h-5 w-5 rotate-180 '} alt=""/>
                    </div>

                    <span
                        className={'IranSansMedium  pt-1 text-text-blue-light  whitespace-nowrap block w-full text-center '} style={{
                            fontSize:'0.7rem'
                    }}>

                        {unsentUsers.length}

                        {" "}


                        نفر ثبت نشده</span>
                </div>
            </div>
        </div>
    );
};

export default Admin;