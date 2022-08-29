import React, {useEffect, useState} from 'react';
import {Button} from "@material-ui/core";

const Passed = (props: {
    saved: boolean
    workHours: number
    trainingHours: number
    whatDidUserDo: string
    dayData: any
}) => {


    const [collapsedDetails, setCollapsedDetails] = useState(true);
    const [filteredTextFields, setFilteredTextFields] = useState([]);

    useEffect(() => {
        setFilteredTextFields(props.dayData.textFields.filter((textField: any) => textField.value))

    }, [props.dayData]);
    return (
        <div className={'w-full flex flex-col justify-start items-center overflow-scroll pb-52'}>


            <img className={'w-20 h-20 mt-14'}
                 src={`${props.saved ? '/svg/passed-saved.svg' : '/svg/passed-unsaved.svg'} `} alt="Report Saved"/>


            {props.saved ?

                <div className={'mt-5 flex flex-col justify-center items-center text-text-blue-light text-center'}>

                    <span className={'block text-primary IranSansMedium '}> گزارش برای این روز ثبت شده است</span>


                    <div className={'flex flex-row justify-center items-center w-full mt-5'}>
                        <div
                            className={'rounded-xl border border-deactive-border flex flex-row justify-center items-center   py-2 ml-5 '}>
                            {/*todo change the index to text*/}
                            <span
                                className={'IranSansMedium text-primary mx-3 text-xl '}>{props.dayData.timeFields ? props.dayData.timeFields[0] ? props.dayData.timeFields[0].value ?? "00:00" : "00:00" : "00:00"}</span>
                            <img className={'ml-2'} src="/svg/work-glyph.svg" alt=""/>

                        </div>

                        <div
                            className={'rounded-xl border border-deactive-border flex flex-row justify-center items-center   py-2'}>
                            <span
                                className={'IranSansMedium text-primary mx-3 text-xl '}>{props.dayData.timeFields ? props.dayData.timeFields[1] ? props.dayData.timeFields[1].value ?? "00:00" : "00:00" : "00:00"}</span>
                            <img className={'ml-2'} src="/svg/training-glyph.svg" alt=""/>

                        </div>


                    </div>


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
                                        className={`w-32 rounded-2xl h-12   text-primary IranSansMedium bg-background border-primary `}>
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
                            props.dayData.textFields.map((tField: any) => {
                                if (tField.value)
                                    if (tField.value.replaceAll(" ", ""))
                                        return <div
                                            className={'flex flex-col justify-center items-center mt-6 '}>
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

        </div>
    );
};

export default Passed;