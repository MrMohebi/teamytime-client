export const GetDayNumberByID = (id: string) => {
    return parseInt(id.split('-')[1])
}
