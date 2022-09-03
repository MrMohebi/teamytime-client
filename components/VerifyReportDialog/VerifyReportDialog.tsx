import React, {useState} from 'react';
import {AdminID, BaseURL, CompanyId} from "../../store/store";
import {Button} from "@material-ui/core";
import {editAdminReview} from "../../Requests/Requests";
import {fullDate} from "../../helpers/FullDate";
import token from "../../pages/admin/[token]";
import {CircularProgress} from "@material-ui/core";

const VerifyReportDialog = (props: {
    userID: string,
    workingHours: string,
    trainingHours: string,
    name: string,
    role: string,
    show: boolean,
    onClose: Function,
    jalaliDate: string
}) => {


    const [btnLoading, setBtnLoading] = useState(false);


    const verifyReport = (adminName: string, state: string, userId: string) => {

        //states = warning,verified,improvement
        const adminReview = [
            {
                name: "آقای یزدانی",
                state: state
            }
        ]
        setBtnLoading(true)


        let myHeaders = new Headers();
        myHeaders.append("token", AdminID());
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("userID", userId);
        urlencoded.append("companyID", CompanyId());
        urlencoded.append("jalaliDate", props.jalaliDate);
        urlencoded.append("adminReview", JSON.stringify(adminReview));

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
        };

        fetch("https://time.m3m.dev/api/editAdminReview.php", requestOptions)
            .then(response => {
                response.text()
                setBtnLoading(false)

                props.onClose()
            })
            .then(result => {
                console.log(result)
                setBtnLoading(false)
            })
            .catch(error => {
                console.log('error', error)
                setBtnLoading(false)
            })


        // editAdminReview(AdminID(), userId, CompanyId(), "[{}]", fullDate(0)).then((value) => {
        //     console.log(value)
        // })
    }
    return (
        <div id={'verify-dialog-container'}
             onClick={(event) => {
                 if ((event.target as HTMLDivElement).id === event.currentTarget.id)
                     props.onClose()
             }}
             className={`fixed h-full w-full left-0 top-0 z-50 bg-black/30 backdrop-blur transition-all ${props.show ? "" : "opacity-0 pointer-events-none"}`}>
            <div
                className={'bottom-5 fixed left-1/2 -translate-x-1/2 w-11/12 rounded-2xl bg-background grid grid-rows-3 grid-cols-1 max-w-lg '}>
                <div className={'row-span-2 flex flex-row justify-between items-start pt-6 px-6'}>
                    <div className={'flex flex-col justify-start items-start'}>
                        <span className={'IranSansMedium text-white text-lg'}>تایید گزارش</span>
                        <div
                            className={'flex flex-row justify-center items-center shrink-0 mt-5'}>
                            <div
                                className={'h-12 w-12 rounded-xl bg-primary overflow-hidden '}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={` /img/no-image.png `}
                                    alt="Arnoya"
                                    className={'w-full h-full block object-cover ml-2'}/>
                            </div>
                            <div
                                className={'flex h-full flex-col justify-around items-start mr-3'}>
                                            <span
                                                className={'block IranSansMedium text-md text-white'}>{props.name}</span>
                                <span
                                    className={'block text-text-blue-light mt-1 IranSansMedium '}
                                    style={{
                                        fontSize: '0.8rem'
                                    }}>{props.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className={'flex flex-col justify-center items-center  mt-5'}>
                        <div
                            className={'rounded-xl border border-deactive-border flex flex-row justify-center items-center py-2'}>
                            {/*todo change the index to text*/}
                            <span
                                className={'IranSansMedium text-primary mx-3 text-xl '}>{props.workingHours ?? "00:00"}</span>
                            <img className={'ml-2'} src="/svg/work-glyph.svg" alt=""/>

                        </div>

                        <div
                            className={'rounded-xl border border-deactive-border flex flex-row justify-center items-center mt-3 py-2'}>
                            <span
                                className={'IranSansMedium text-primary mx-3 text-xl '}>{props.trainingHours ?? "00:00"}</span>
                            <img className={'ml-2'} src="/svg/training-glyph.svg" alt=""/>

                        </div>


                    </div>
                </div>

                <div className={'row-span-1 flex flex-row justify-around items-center w-full mt-4 mb-2 '}>
                    <Button onClick={() => {
                        verifyReport('آقای یزدانی', "warning", props.userID)
                    }} style={{}} className={'w-1/3 border-solid border-2 border-red h-14 text-red rounded-xl mx-1'}>

                        {
                            btnLoading ?
                                <div className={'text-red'}>
                                    <CircularProgress color={"inherit"}/>
                                </div> :
                                <span className={'IranSansMedium'}> اخطار افت کاری</span>


                        }
                    </Button>
                    <Button onClick={() => {
                        verifyReport('آقای یزدانی', "verified", props.userID)
                    }} style={{}}
                            className={'w-1/3 border-solid border-2 border-primary h-14 text-primary rounded-xl mx-1'}>
                        {
                            btnLoading ?
                                <CircularProgress/> :
                                <span className={'IranSansMedium '}>تایید گزارش</span>


                        }
                    </Button>
                    <Button onClick={() => {
                        verifyReport('آقای یزدانی', "improvement", props.userID)
                    }} style={{}}
                            className={'w-1/3 border-solid border-2 border-green h-14 text-green rounded-xl mx-1'}>
                        {
                            btnLoading ?
                                <div className={'text-green'}>
                                    <CircularProgress color={"inherit"}/>
                                </div>
                                :
                                <span className={'IranSansMedium'}>پیشرفت کاری</span>


                        }
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default VerifyReportDialog;