import * as React from 'react'
import {useEffect, useState} from "react";
import Image from "next/image";

interface OptionsInterface{
    label:String,
    id:String|number,
    position:String
}

interface onSelectInterface{
    (value:any):any
}

const TInputSearch:React.FC<{placeholder?:string, icon?:string|null, options:OptionsInterface[], onSelect:onSelectInterface}> = ({onSelect,options,placeholder, icon}) =>{
    const [isOptionsShow, setIsOptionsShow] = useState(false)
    const [search, setSearch] = useState("")
    const [availableOptions, setAvailableOptions] = useState(options)

    const handelInputUpdate = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value
        setSearch(value)
        if(value.length > 0){
            setAvailableOptions(options.filter(eOptions=> eOptions.label.search(value) !== -1))
            setIsOptionsShow(true)
        }else{
            setIsOptionsShow(false)
        }
    }

    useEffect(()=>{
        setAvailableOptions([])
    },[])

    const handelSelectItem = (item:OptionsInterface) => {
        onSelect(item)
        setSearch(item.label as any)
        setIsOptionsShow(false)
    }

    const handelClickInp = () =>{
        setIsOptionsShow(true)
    }
    // const handelBlurInp = () =>{
    //     setIsOptionsShow(false)
    // }
    return(
        <div className="">
            <div onClick={handelClickInp} >
                <div className="bg-default rounded-xl w-fit p-2 flex justify-center items-center">
                    {!!icon && <Image src={icon} alt="icon" height={20} width={20}/>}
                    <input value={search} onInput={handelInputUpdate} type="text" placeholder={placeholder} className={'bg-default border-0 mr-3'}/>
                </div>
            </div>
            <div className={(isOptionsShow ? "absolute" : "hidden" )+ " rounded-lg shadow-lg mt-2 w-[300px]"}>
                {availableOptions.map((eOption, index)=>{
                    return(
                        <div key={Math.floor(Math.random()*100).toString()+eOption.id.toString()} className={"px-4"}>
                            <div className={"flex items-center py-3  cursor-pointer hover:bg-default  pr-10 "} onClick={()=>handelSelectItem(eOption)}>
                                <div className={'text-notEmphasis'}>
                                    {eOption.id}
                                </div>
                                <div className={"mr-6 ml-2"}>
                                    {eOption.label}
                                </div>
                                <div className={"text-notEmphasis"}>
                                    {eOption.position}
                                </div>
                            </div>
                            {availableOptions.length-1 !== index &&
                                <div className={"py-1 text-default "}>
                                    <hr className={"w-[80%] "}/>
                                </div>
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export default TInputSearch