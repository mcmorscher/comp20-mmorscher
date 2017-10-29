# README for Lab 6 - Captain's Log

All aspects of the assignment have been implemented correctly.

I did not collaborate with anyone on this assignment, but I found the questions and answers on Piazza to be pretty helpful in clarifying expected behavior.

I originally spent 3 hours on this assignment, which worked without sorting since I used Google Chrome. - However, after reading about browser behavior on Piazza I had to return to this lab to implement manual sorting in case another browser (ie. Safari) would not preserve order in localStorage.
- After doing this, I discovered that Google Chrome is one of few browsers which implements unstable sorting (https://stackoverflow.com/questions/3026281/array-sort-sorting-stability-in-different-browsers). - This took quite a while to figure out, because Chrome will stable sort on fewer than 10 elements, and not knowing this my program seemed to have input-dependent undefined sorting determination.
- All in all, I ended up spending close to *10 hours* tracking down problems and compensating for browser issues.

I give credit to https://www.dmcinfo.com/latest-thinking/blog/id/9312/sorting-in-javascript-handling-google-chromes-unstable-sort for explaining Chrome's unstable sorting and providing logic for a stable sort implementation.