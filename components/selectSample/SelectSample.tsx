import * as React from 'react'
import {useState} from "react";

interface onClickInterface{
    (value:any):any
}

interface OptionsInterface {
    label:any
    value:any
}

const SelectSample:React.FC<{options:OptionsInterface[], selectedOption?:OptionsInterface, onClick?:onClickInterface}> = ({options,selectedOption,onClick}) =>{
    const [selectedItem, seSelectedItem] = useState(selectedOption)
    const handelSelect = (item:OptionsInterface) =>{
        seSelectedItem(item)
        onClick && onClick(item)
    }
    const isSelected = (item:OptionsInterface) =>{
        return selectedItem?.value === item.value
    }
    return(
        <div className="flex flex-wrap">
            {
                options.map(eOption=>{
                    return(
                        <div key={eOption.value+"_Options"} className={"px-2 py-1 rounded-md bg-default mx-2 " + (isSelected(eOption)? "text-primary" : "text-notEmphasis")} onClick={()=>handelSelect(eOption)}>
                            {eOption.label}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SelectSample