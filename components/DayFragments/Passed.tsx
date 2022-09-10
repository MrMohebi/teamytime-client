import React, {useEffect, useRef, useState} from 'react';
import {Button} from "@material-ui/core";
import {Player} from '@lottiefiles/react-lottie-player';
/* eslint-disable @next/next/no-img-element */
const Passed = (props: {
    saved: boolean
    workHours: number
    trainingHours: number
    whatDidUserDo: string
    dayData: any,
    reportState: string
    adminReview: [any]
}) => {


    const [collapsedDetails, setCollapsedDetails] = useState(true);
    const [filteredTextFields, setFilteredTextFields] = useState([]);

    useEffect(() => {
        if (props.dayData.textFields)
            setFilteredTextFields(props.dayData.textFields.filter((textField: any) => textField.value))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.dayData]);

    const lotieRef = useRef<any>([])
    return (
        <div className={'w-full flex flex-col justify-start items-center overflow-scroll pb-96'}>

            <img className={'w-20 h-20 mt-14'}
                 src={`${props.saved ? '/svg/passed-saved.svg' : '/svg/passed-unsaved.svg'} `} alt="Report Saved"/>


            {props.saved ?

                <div className={' flex flex-col justify-center items-center text-text-blue-light text-center'}>

                    {/*<span className={'block text-primary IranSansMedium '}> گزارش برای این روز ثبت شده است</span>*/}


                    <div
                        className={`w-full overflow-hidden relative pb-20  ${filteredTextFields.length > 1 && collapsedDetails ? "h-36" : ""}`}>

                        {filteredTextFields.length > 1 ?
                            <div>
                                <div
                                    className={`w-full bg-secondary absolute bottom-0 left-1/2 -translate-x-1/2 z-10 ${collapsedDetails ? "" : ""}`}>
                                    <Button
                                        onClick={() => {
                                            setCollapsedDetails((lastState) => {

                                                return !lastState

                                            })
                                        }}
                                        style={{border: 'solid'}}
                                        className={`rounded-xl px-3 text-primary IranSansMedium bg-background border-primary z-[51] `}>
                                            <span className={"IranSansMedium"}>{collapsedDetails ?
                                                "نمایش بیشتر"
                                                :
                                                "نمایش کم تر"
                                            }
                                            </span>
                                    </Button>
                                </div>
                                <div
                                    className={`absolute w-full h-full top-0 left-0 bg-gradient-to-b from-secondary/0 via-secondary/50 to-secondary ${filteredTextFields.length > 1 && collapsedDetails ? "" : "opacity-0"}`}></div>

                            </div>
                            :
                            null
                        }


                        {
                            props.dayData.textFields.map((tField: any, index: number) => {
                                if (tField.value)
                                    if (tField.value.replace(/ /g, ""))
                                        return <div key={index + "tf"}
                                                    className={'flex flex-col justify-center items-center mt-6 px-4'}>
                                            <span
                                                className={'text-primary IranSansMedium text-sm '}>{tField.title}</span>
                                            <p className={'whitespace-pre-line IranSansMedium text-sm mt-2'}>{tField.value.replace(/\n/g, '\n')}</p>
                                        </div>
                            })
                        }
                    </div>


                </div>
                :

                <div className={'h-full flex-col justify-center items-center'}>
                            <span
                                className={' block text-center IranSansMedium text-red mt-7 text-md'}>مهلت ثبت گزارش تمام شده است</span>
                    <span
                        className={' block text-center IranSansMedium text-text-blue-light mt-7 text-sm'}> برا این روز گزارشی ثبت نکرده اید</span>
                </div>


            }


            {
                props.saved ?
                    <div
                        className={'fixed bottom-5 left-1/2 -translate-x-1/2 w-11/12  max-w-md rounded-2xl bg-primary-dark flex flex-row justify-between items-start p-4 z-50 '}>


                        <div
                            className={`color-indicator absolute right-0 top-1/2 h-1/2 -translate-y-1/2 ${props.reportState === 'verified' ? "bg-primary" : props.reportState === "warning" ? 'bg-red' : props.reportState === 'improvement' ? "bg-green" : 'bg-gray-600'}  w-1 rounded-tl-xl rounded-bl-xl`}></div>

                        <div className={'flex flex-col justify-center items-start'}>
                            <span className={'IranSansMedium text-primary'}>گزارش برای این روز ثبت شده</span>


                            <div
                                className={'flex flex-row justify-start items-center w-full  h-10 mt-6 overflow-x-scroll overflow-y-hidden pl-10'}>

                                {
                                    props.adminReview.length ?
                                        props.adminReview.map((item, index) => {
                                            return <Button key={index + 'i'}
                                                           style={{}}
                                                           onClick={(e) => {

                                                               try {
                                                                   if (item.state === 'improvement' && (e.target as any).id === e.currentTarget.id)
                                                                       lotieRef.current[index].play();
                                                               } catch (e) {

                                                               }


                                                           }}
                                                           className={`border-solid shrink-0 mx-2 flex flex-row justify-center items-center verify-btn  border ${item.state === 'verified' ? "border-primary text-primary" : item.state === "warning" ? 'border-red text-red' : item.state === 'improvement' ? "border-green text-green" : 'border-gray-400 text-gray-400'} border-primary rounded-xl  px-4  `}>
                                                                    <span className={'IranSansMedium text-inherit'}>

                                                                        {
                                                                            item.state === 'verified' ? "ممنون از گزارش" : item.state === "warning" ? 'نیاز به رشد' : item.state === 'improvement' ? "ایول دمت گرم" : 'تایید نشده'
                                                                        }

                                                                    </span>

                                                <div
                                                    className={`absolute all-pointer-none pb-3 overflow-visible ${item.state === 'improvement' ? '' : 'hidden pointer-events-none'}`}>
                                                    <Player
                                                        ref={el => lotieRef.current[index] = el}
                                                        src='/lottie/cheers.json'
                                                        style={{height: '100px', width: '100px', pointerEvents: 'none'}}

                                                    >
                                                    </Player>

                                                </div>


                                            </Button>
                                        })
                                        :
                                        <Button
                                            className={`border-solid shrink-0 mx-2 flex flex-row justify-center items-center verify-btn  border border-gray-400 text-gray-400 border-primary rounded-xl  px-4  `}>
                                                                    <span className={'IranSansMedium text-inherit'}>

                                                                        {
                                                                            'تایید نشده'
                                                                        }

                                                                    </span>

                                        </Button>
                                }


                            </div>


                        </div>
                        <div className={'flex flex-col justify-center items-start'}>

                            <div
                                className={'rounded-xl border border-inactive-border flex flex-row justify-center items-center py-2   w-28'}>
                                {/*todo change the index to text*/}
                                <span
                                    className={'IranSansMedium text-primary mx-3 text-xl '}>{props.dayData.timeFields ? props.dayData.timeFields[0] ? props.dayData.timeFields[0].value ?? "00:00" : "00:00" : "00:00"}</span>
                                <img className={'ml-2'} src="/svg/work-glyph.svg" alt=""/>

                            </div>

                            <div
                                className={'rounded-xl border border-inactive-border flex flex-row justify-center items-center py-2 mt-3 w-28'}>
                            <span
                                className={'IranSansMedium text-primary mx-3 text-xl '}>{props.dayData.timeFields ? props.dayData.timeFields[1] ? props.dayData.timeFields[1].value ?? "00:00" : "00:00" : "00:00"}</span>
                                <img className={'ml-2'} src="/svg/training-glyph.svg" alt=""/>

                            </div>


                        </div>
                    </div>
                    :
                    <div
                        className={'fixed bottom-5 left-1/2 -translate-x-1/2 w-11/12  max-w-md rounded-2xl bg-primary-dark flex flex-col justify-start items-center p-4 z-50 '}>

                        <div className={'w-full flex flex-row justify-between items-center'}>
                            <span className={"IranSansMedium text-red"}>جریمه</span>
                            <div className={' flex flex-row justify-center items-center'}>
                                <span className={'IranSansMedium text-text-blue-light ml-0.5'}>50,000</span>
                                <img src="/svg/toman.svg" className={'w-5 h-5'} alt=""/>
                            </div>
                        </div>

                        <Button onClick={(event) => {

                            try {
                                if ((event.currentTarget.firstChild!.firstChild as HTMLSpanElement).innerText !== 'به زودی (;') {
                                    (event.currentTarget.firstChild!.firstChild as HTMLSpanElement).innerText = 'به زودی (;'

                                } else {
                                    (event.currentTarget.firstChild!.firstChild as HTMLSpanElement).innerText = 'پرداخت'

                                }


                            } catch (e) {

                            }

                        }} className={'bg-primary w-full rounded-2xl text-white h-14 mt-4'}>
                            <span className={"IranSansMedium"}>پرداخت </span>
                        </Button>

                    </div>
            }


        </div>
    );
};

export default Passed;