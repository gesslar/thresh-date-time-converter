const rlDateInput = document.getElementById( "rldateinput" )
const rlTimeInput = document.getElementById( "rltimeinput" )
const icDateTimeOuput = document.getElementById( "icdatetimeoutput" )
const etDateTimeOuput = document.getElementById( "etdatetimeoutput" )
const cpIc = document.getElementById( "copyic" )
const cpEt = document.getElementById( "copyet" )
const copiedIc = document.getElementById( "copiedic" )
const copiedEt = document.getElementById( "copiedet" )

const getCurrentTimeET = (timestamp) => {
    let currentDate, currentTime;
    
    if(timestamp === undefined) {
        currentDate = moment.tz( "America/Toronto" )
        currentTime = moment.tz( "America/Toronto" )
    } else {
        currentDate = moment.tz( timestamp, "America/Toronto" )
        currentTime = moment.tz( timestamp, "America/Toronto" )
    }
    
    return `${currentDate.format("yyyy-MM-DD")} ${currentTime.format("LT")}`
}

const setCurrentDateTime = () => {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat( "en-US", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    })

    const dateParts = formatter.formatToParts(now)
    const dateString = dateParts.filter( ({ type, value }) => {
        if(type === "literal") return false
        return true 
    }).map( ({ type, value }) => {
        if(value.match(/[0-9]+/)) {
            const num = parseInt(value)
            if(num < 10) return `0${num}`
        }
        return value 
    })

    rlDateInput.value = `${dateString[2]}-${dateString[0]}-${dateString[1]}`
    rlTimeInput.value = `${dateString[3]}:${dateString[4]}:00.000`

    updateTimes(rlDateInput.value, rlTimeInput.value)
}

const updateTimes = (dateValue, timeValue) => {
    const date = new Date(`${dateValue} ${timeValue}`)
    const threshDate = new ThreshDateTime( date )
    const etDateTime = getCurrentTimeET( date.getTime() )

    icDateTimeOuput.value = threshDate.getDisplayValue()
    etDateTimeOuput.value = etDateTime
}

const copyInformation = (control, statuscontrol) => {
    control.select()
    control.setSelectionRange(0, 999999)
    document.execCommand("copy")
    control.blur()
    window.getSelection().removeAllRanges()
    statuscontrol.classList.remove("copied-hide")
    setTimeout( control => {
        control.classList.add("copied-hide")
    }, 1000, statuscontrol)
}

rlDateInput.addEventListener("change", event => updateTimes(rlDateInput.value, rlTimeInput.value))
rlTimeInput.addEventListener("change", event => updateTimes(rlDateInput.value, rlTimeInput.value))
cpIc.addEventListener("click", event => copyInformation(icDateTimeOuput, copiedIc))
cpEt.addEventListener("click", event => copyInformation(etDateTimeOuput, copiedEt))
