export const fullDate = (dayOffset: number) => {
    const d = new Date()
    d.setDate(d.getDate() + dayOffset)

    let arr = (new Intl.DateTimeFormat('en-US-u-ca-persian', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }).format(d).split('/'))

    let string = arr[2] + "/" + (parseInt(arr[0]) < 10 ? "0" + arr[0] : arr[0]) + "/" + (parseInt(arr[1]) < 10 ? "0" + arr[1] : arr[1])
    console.log(string.toString())
    return string.toString().replace(/[a-zA-Z ]/g, '')
}