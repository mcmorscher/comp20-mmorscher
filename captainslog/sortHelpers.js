var monthOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//TODO: use string split instead since leading zeros will be missing and mess up the substrings

function sortByYear(a, b){
    aYear = a.substr(20,4);
    bYear = b.substr(20,4);
    return compare(aYear, bYear);
}

function sortByMonth(a, b){
    aMonth = monthOfYear.indexOf(a.substr(4,3));
    bMonth = monthOfYear.indexOf(b.substr(4,3));
    return compare(aMonth, bMonth);
}

function sortByDay(a, b){
    aDay = a.substr(8, 2);
    bDay = b.substr(8, 2);
    return compare(aDay, bDay);
}

function sortByHour(a, b){
    aHour = a.substr(11, 2);
    bHour = b.substr(11, 2);
    return compare(aHour, bHour);
}

function sortByMinute(a, b){
    aMin = a.substr(14, 2);
    bMin = b.substr(14, 2);
    return compare(aMin, bMin);
}

function sortBySecond(a, b){
    aSec = a.substr(17, 2);
    bSec = b.substr(17, 2);
    return compare(aSec, bSec);
}

function compare(aField, bField){
    if(aField == bField)
        return 0;
    else if(aField < bField)
        return -1;
    else
        return 1;
}