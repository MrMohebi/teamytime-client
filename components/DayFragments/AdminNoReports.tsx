import React from 'react';

const AdminNoReports = () => {
    return (
        <div className={'h-full w-full flex  flex-col justify-center items-center pt-20'}>


            <img src="/svg/white-calendar.svg" className={'h-20 w-20'} alt="No report"/>
            <span className={'IranSansMedium mt-6 '}>گزارشی تا کنون برای این روز ثبت نشده است</span>
        </div>
    );
};

export default AdminNoReports;