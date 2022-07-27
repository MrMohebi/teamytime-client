import React, {useEffect, useRef, useState} from 'react';

import {useDebouncedCallback} from "use-debounce";

const TimePicker = (props: {
    title: string
    setHour: Function
    setMinute: Function,
    sample: string,
    defaultTime: string
}) => {
// hi elf
    const [currentActiveHour, setCurrentActiveHour] = useState(0);
    const [currentActiveMinute, setCurrentActiveMinute] = useState(0);


    const customHourRef = useRef<HTMLDivElement>(null);
    const customMinuteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {


        props.setHour(currentActiveHour)
        props.setMinute(currentActiveMinute)


    }, [currentActiveMinute, currentActiveHour])


    const resetMinutes = () => {
        if (customMinuteRef.current)
            customMinuteRef.current.scrollTo(0, 0)
        setCurrentActiveMinute(0)
        setCurrentActiveHour(currentActiveHour)
    }


    useEffect(() => {


        if (props.defaultTime) {
            if (props.defaultTime.split(":").length === 2) {

                hourScrollTo(parseInt(props.defaultTime.split(':')[0]))
                minuteScrollTo(parseInt(props.defaultTime.split(':')[1])/10)
            }
        }
    }, [props.defaultTime]);

    const hourScrollTo = (hourIndex: number) => {
        if (customHourRef) {

            if (customHourRef.current) {
                let childH = customHourRef.current.children[1].getBoundingClientRect().height;
                customHourRef.current.scrollTo(0, (hourIndex + 1) * childH)
            }

        }
    }

    const minuteScrollTo = (hourIndex: number) => {
        if (customMinuteRef) {

            if (customMinuteRef.current) {
                let childH = customMinuteRef.current.children[1].getBoundingClientRect().height;
                customMinuteRef.current.scrollTo(0, (hourIndex + 1) * childH)
            }

        }
    }


    const debouncedScrollHour = useDebouncedCallback(
        (e) => {

            let childH = e.target.children[1].getBoundingClientRect().height;
            e.target.childNodes.forEach((item: HTMLDivElement, index: number) => {
                if (Math.abs(((index) * childH) - e.target.scrollTop) < 10) {
                    if (index - 1 > -1) {
                        setCurrentActiveHour(index - 1)
                    }

                }
            })


        }
        , 50
    )


    const debouncedScrollMinute = useDebouncedCallback(
        (e) => {


            let childH = e.target.children[1].getBoundingClientRect().height;

            e.target.childNodes.forEach((item: HTMLDivElement, index: number) => {
                if (Math.abs((index * childH) - e.target.scrollTop) < 10) {

                    if (index - 1 > -1) {
                        setCurrentActiveMinute((index - 1) * 10)
                    }

                }
            })


        }
        , 50
    )
    return (
        <div className={'time-picker bg-secondary pb-5'}>
            <div className={'w-full h-12 text-white IranSans pt-2 pr-3'}>{props.title}</div>
            <div className={'w-full flex flex-row justify-between items-center px-3'}>


                {/*select hour*/}
                <div className={'grid grid-cols-2 grid-rows-2 gap-3'}>


                    {
                        (JSON.parse(props.sample) as []).map((item: string, index) => {

                            let hour = parseInt(item.split(':')[0])

                            return (
                                <div key={index + 'hours'}


                                     className={`h-10 w-12  border-2 transition-all ease-in-out  flex flex-col justify-center items-center rounded-xl ${(hour === currentActiveHour && currentActiveMinute === 0) ? 'border-primary text-primary' : 'border-deactive-border text-deactive-border'}`}
                                     onClick={() => {
                                         if (customHourRef.current) {
                                             let timeHeight = customHourRef.current.children[2].getBoundingClientRect().height
                                             let scrollSmootherHeight = customHourRef.current.children[0].getBoundingClientRect().height
                                             customHourRef.current.scrollTo(0, ((hour) * timeHeight) + (scrollSmootherHeight / 2))
                                             setCurrentActiveHour(hour);
                                             resetMinutes();
                                         }
                                     }}>
                                    {hour + "H"}
                                </div>
                            )
                        })
                    }
                    {/*{*/}
                    {/*    Array(4).fill('').map((value, index, array) => {*/}

                    {/*        return (*/}
                    {/*            <div key={index + 'hours'}*/}


                    {/*                 className={`h-10 w-12  border-2 transition-all ease-in-out  flex flex-col justify-center items-center rounded-xl ${(index + 1 === currentActiveHour && currentActiveMinute === 0) ? 'border-primary text-primary' : 'border-deactive-border text-deactive-border'}`}*/}
                    {/*                 onClick={() => {*/}
                    {/*                     if (customHourRef.current) {*/}
                    {/*                         let timeHeight = customHourRef.current.children[2].getBoundingClientRect().height*/}
                    {/*                         let scrollSmootherHeight = customHourRef.current.children[0].getBoundingClientRect().height*/}
                    {/*                         customHourRef.current.scrollTo(0, ((index + 1) * timeHeight) + (scrollSmootherHeight / 2))*/}
                    {/*                         setCurrentActiveHour(index + 1);*/}
                    {/*                         resetMinutes();*/}
                    {/*                     }*/}
                    {/*                 }}>*/}
                    {/*                {index + 1 + "H"}*/}
                    {/*            </div>*/}
                    {/*        )*/}

                    {/*    })*/}
                    {/*}*/}

                </div>


                <div className={'custom-picker flex flex-row justify-between items-center'}>

                    {/*minute*/}

                    <div
                        className={'h-28 w-20 relative  flex flex-col justify-start items-center snap-y snap-mandatory overflow-hidden'}>

                        <div
                            className={'w-full absolute top-0  border-b-4 border-primary h-1/3 z-10 pointer-events-none   '}
                            style={{
                                background: "rgba(29,39,49,0.5)"
                            }}></div>
                        <div
                            className={'w-full absolute top-1/2 -translate-y-1/2  h-1/3 z-10 pointer-events-none'}></div>
                        <div
                            className={'w-full absolute bottom-0 border-t-4 border-primary h-1/3 z-10 pointer-events-none  '}
                            style={{
                                background: "rgba(29,39,49,0.5)"
                            }}></div>
                        <div
                            ref={customMinuteRef}
                            className={'h-full absolute w-full flex flex-col justify-start items-center overflow-y-scroll hide-scrollbar snap-y snap-mandatory scroll-smooth'}

                            onScroll={debouncedScrollMinute}
                        >
                            <div className={'h-20 w-full  shrink-0 flex flex-col justify-center items-center '}/>

                            {
                                Array(6).fill('').map((item, index) => {
                                    return (
                                        <div key={'i' + index}
                                             className={'h-10 w-full snap-center  shrink-0 flex flex-col justify-center items-center text-primary text-xl pb-1 '}>
                                            {index * 10 === 0 ? '00' : index * 10}
                                        </div>

                                    )
                                })
                            }
                            <div className={'h-20 w-full  shrink-0 flex flex-col justify-center items-center '}/>


                        </div>
                    </div>


                    <div style={{
                        fontSize: '2rem',
                        lineHeight: '4rem'
                    }} className={' text-primary  text-center flex flex-col justify-center items-center mx-2 pb-4'}>:
                    </div>


                    {/*hour*/}


                    <div
                        className={'h-28 w-20 relative  flex flex-col justify-start items-center snap-y snap-mandatory overflow-hidden'}>


                        <div
                            className={'w-full absolute top-0  border-b-4 border-primary h-1/3 z-10 pointer-events-none '}
                            style={{
                                background: "rgba(29,39,49,0.5)"
                            }}></div>
                        <div
                            className={'w-full absolute top-1/2 -translate-y-1/2  h-1/3 z-10 pointer-events-none'}></div>
                        <div
                            className={'w-full absolute bottom-0 border-t-4 border-primary h-1/3 z-10 pointer-events-none  '}
                            style={{
                                background: "rgba(29,39,49,0.5)"
                            }}></div>


                        <div ref={customHourRef}
                             className={'h-full absolute w-full flex flex-col justify-start items-center overflow-y-scroll hide-scrollbar snap-y snap-mandatory scroll-smooth'}
                             onScroll={debouncedScrollHour}
                        >
                            <div className={'h-20 w-full  shrink-0 flex flex-col justify-center items-center '}/>

                            {
                                Array(25).fill('').map((item, index) => {
                                    return (
                                        <div id={'h-' + index} key={'i' + index}
                                             className={'h-10 w-full snap-center text-primary text-xl pb-1 shrink-0 flex flex-col justify-center items-center '}>
                                            {index + 1 > 10 ? index : '0' + index}
                                        </div>

                                    )
                                })
                            }
                            <div className={'h-20 w-full  shrink-0 flex flex-col justify-center items-center '}/>


                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TimePicker;