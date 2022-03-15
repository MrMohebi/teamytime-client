import type { NextPage } from 'next'
import Image from "next/image";
import TInputSearch from "../components/utilitis/inputSearch/TInputSearch";
import logo from "/public/img/logo.png"
import {useState} from "react";
import * as React from "react";
import SelectSample from "../components/selectSample/SelectSample";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import {Calendar} from 'react-modern-calendar-datepicker';

const Home: NextPage = () => {
    const [selectedUser, setSelectedUser] = useState()
    const [selectedDay, setSelectedDay] = useState()

    const users = [
        {
            label:"mamad",
            id:"7",
            position:"برنامه نویس"
        },
        {
            label:"mamad ali",
            id:"4",
            position:"طراح"
        },
        {
            label:"hassan",
            id:"5",
            position:"مالی"
        },
    ]

    const defaultHours = [{label:"4H", value:4},{label:"5H", value:5}, {label:"6H", value:6}, {label:"7H", value:7}]
    const defaultDays = [{label:"امروز", value:'today'},{label:"دیروز", value:"yesterday"}, {label:"دوروز پیش", value:"theDayBefore"}]


    const handelSelectDay = (day:any) => {
        setSelectedDay(day)
    }


    return (
      <div className="p-6 flex flex-col justify-center space-y-4">
          <div className={"flex items-center"}>
              <div className={"ml-2"}>
                  <Image src={logo} alt={"logo"} height={30} width={70}/>
              </div>
              <TInputSearch options={users} onSelect={(value)=>{setSelectedUser(value)}} placeholder={"کد کاربری"} icon={"/svg/search-icon.svg"}/>
          </div>
          {  // @ts-ignore
              selectedUser?.id &&
              <div className={"flex  items-center space-x-4"}>
                  <div className={"bg-default rounded-full w-10 h-10 flex justify-center items-center ml-4"}>
                      <Image src={"/svg/user.svg"} alt={"user"} width={17} height={17}/>
                  </div>
                  <div className={""}>
                      {  // @ts-ignore
                          selectedUser.label}
                  </div>
                  <div className={"text-notEmphasis"}>
                      {  // @ts-ignore
                          selectedUser.position}
                  </div>

              </div>
          }
          <div className={"py-1 text-default "}>
              <hr className={""}/>
          </div>

          <div className={"flex items-center"}>
              <div className={"text-primary ml-4"}>
                  تاریخ
              </div>
              <SelectSample options={defaultDays} onClick={(value)=>{console.log(value)}}/>
          </div>
          <div className={"w-full flex justify-center"}>
              <Calendar
                  colorPrimary="#0099ff"
                  value={selectedDay}
                  onChange={handelSelectDay}
                  calendarClassName="calenderCss"
                  locale="fa"
                  shouldHighlightWeekends
              />
          </div>

          <div className={"py-1 text-default "}>
              <hr className={""}/>
          </div>

          <div className={"flex items-center"}>
              <div className={"text-primary ml-4"}>
                  مدت زمان
              </div>
              <SelectSample options={defaultHours} onClick={(value)=>{console.log(value)}}/>
          </div>

      </div>
  )
}

export default Home
