All aspects of the assignment have been implemented correctly. 

There are a few areas open to interpretation which my program may display different behavior for, such as leaving the polyline on the map after closing the relevant InfoWindow. I don't believe we have to remove the line, and I figured it would be useful for the user to retain this information. I accordingly modified the color and opacity of the line to be noticeable but not obtrusive. 
I also noticed that the behavior of multiple "self" logins is undefined. I chose to display the "self" icon rather than the icon for other people to correctly represent the data. However, since I use the user's current location to calculate landmark distance, if a user were to log in multiple times from different locations and clicked on an older location's icon, the response may be different than expected.

I didn't discuss the assignment with anyone, but found useful guidance from Stack Overflow to understand HTTP POST. Specifically, the answers in https://stackoverflow.com/questions/9713058/sending-post-data-with-a-xmlhttprequest (as pointed to by the assignment) were helpful.

I spent approximately 16 hours completing this assignment.



