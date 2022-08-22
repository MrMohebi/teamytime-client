// @ts-ignore
import $ from 'jquery'
import {CurrentDay} from "../store/store";

export const GoToThisDay = (id:string) => {

    CurrentDay(id)

    const scroller = $('#d-scroller')[0]
    const Rscroller = $('#reports-scroller')[0]
    if (scroller) {
        try {
            let halfSpace = scroller.getBoundingClientRect().width / 2
            let rest = 0;
            scroller.scrollTo(0, 0)

            scroller.querySelectorAll('.header-day').forEach((item:any, childIndex:any) => {


                if (id === 'd-' + childIndex) {
                    let childrenLength = Array.from(scroller!.querySelectorAll('.header-day')).slice(0, childIndex).length
                    childrenLength *= item.getBoundingClientRect().width
                    rest = childrenLength
                    rest += item.getBoundingClientRect().width / 2
                }

            })

            scroller.scrollTo(-(rest + halfSpace), 0)


        } catch (e) {

        }


    }

    if (Rscroller) {
        try {
            let halfSpace = Rscroller.getBoundingClientRect().width / 2
            let rest = 0;
            Rscroller.scrollTo(0, 0)

            Rscroller.querySelectorAll('.reports-day').forEach((item:any, childIndex:any) => {


                if ('r-' + id === 'r-d-' + childIndex) {

                    let childrenLength = Array.from(Rscroller!.querySelectorAll('.reports-day')).slice(0, childIndex).length
                    childrenLength *= item.getBoundingClientRect().width
                    rest = childrenLength
                    rest += item.getBoundingClientRect().width / 2
                }

            })

            Rscroller.scrollTo(-(rest + halfSpace), 0)


        } catch (e) {

        }


    }

}