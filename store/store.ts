import {makeVar} from "@apollo/client";


export const CompanyName = makeVar("arnoya")
export const CompanyId = makeVar("")
export const CompanyTextFields = makeVar([] as any[])
export const CompanyTimeFields = makeVar([] as any[])
export const UserId = makeVar("")
export const AdminID = makeVar("")
export const CurrentSelectedDate = makeVar("")
export const UserLocalDays = makeVar({} as any)
export const CompanyRequiredFields = makeVar([] as any)
export const BaseURL = makeVar("https://time.m3m.dev/")
export const CoolDown = makeVar(false)
export const CurrentDay = makeVar("")
export const CollapseHeader = makeVar(false)
export const StartDate = makeVar("")
export const CompanyAllowedDays = makeVar(0)