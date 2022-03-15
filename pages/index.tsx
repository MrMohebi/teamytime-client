import type { NextPage } from 'next'
import TInput from "../components/utilitis/input/TInput";
import TInputSearch from "../components/utilitis/inputSearch/TInputSearch";

const Home: NextPage = () => {
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


  return (
      <div className={"p-3"}>
          <TInputSearch options={users} onSelect={(value)=>{console.log(value)}} placeholder={"کد کاربری"} icon={"/svg/search-icon.svg"}/>
      </div>
  )
}

export default Home
