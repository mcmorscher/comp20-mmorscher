var monthOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function sortByYear(a, b){
    var aFields = a.split(" ");
    var bFields = b.split(" ");
    aYear = aFields[4];
    bYear = bFields[4];
    return compare(aYear, bYear);
}

function sortByMonth(a, b){
    var aFields = a.split(" ");
    var bFields = b.split(" ");
    aMonth = monthOfYear.indexOf(aFields[1]);
    bMonth = monthOfYear.indexOf(bFields[1]);
    return compare(aMonth, bMonth);
}

function sortByDay(a, b){
    var aFields = a.split(" ");
    var bFields = b.split(" ");
    aDay = aFields[2];
    bDay = bFields[2];
    return compare(aDay, bDay);
}

function sortByHour(a, b){
    var aTime = a.split(" ")[3].split(":");
    var bTime = b.split(" ")[3].split(":");
    aHour = aTime[0];
    bHour = bTime[0];
    return compare(aHour, bHour);
}

function sortByMinute(a, b){
    var aTime = a.split(" ")[3].split(":");
    var bTime = b.split(" ")[3].split(":");
    aMin = aTime[1];
    bMin = bTime[1];
    return compare(aMin, bMin);
}

function sortBySecond(a, b){
    var aTime = a.split(" ")[3].split(":");
    var bTime = b.split(" ")[3].split(":");
    aSec = aTime[2];
    bSec = bTime[2];
    return compare(aSec, bSec);
}

function compare(aField, bField){
    //Simulate leading zeros
    if(aField.length < bField.length)
        aField = "0" + aField;
    else if(bField.length < aField.length)
        bField = "0" + bField;
    
    if(aField == bField)
        return 0;
    else if(aField < bField)
        return -1;
    else
        return 1;
}