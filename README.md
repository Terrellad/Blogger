Intro

This is my Project 5 called capstone.
I have based my project on a blogging platform.
Each element used has been taken from what I have learned during this class while at the same time remaining different from any previous project I have completed.

To Run
Download into a destination of your choice. Then open terminal or command shell of your choosing (will need to look up commands for other command shells). If using terminal then follow these directions:
  1)   Start by going to the directory that contains Project5 folder: cd DIRECTORY (DIRECTORY being replaced with wherever directory you placed Project5).

  2)   Then enter the Project5 directory: cd Project5.

  3)   Finally from there enter python3 manage.py runserver (if you don't have python3 try python. If neither exist download it by sudo apt-get install pythonX.X replacing the X with the latest version of python).

In-depth description
  Index html page
    Has all the different divs which have unique ids allowing different parts of the program to display the correct information for the user upon what the user is doing.

  Layout html page
    Has the navbar which allows the user to go to other pages in the website. If someone visits the site and hasn't signed in or signed up the navbar will show tabs with either subscribe which allows one to become a user. Then sign in for returning users. After one signs in the tabs change with subscribe and sign in being replaced with logout. However the blogger will receive a different list of nav tabs.

  Index.js
    This is where the work on the front-end is handled. This large chunk of javascript creates the information for all the different divs in the index html. Such as listing the catagories that are created by the blogger to which blog post are associated with which catagory. From how the blog post is to look to the user to the comments that each user post. Also handles the form interfaces that the blogger uses. Then take all the information that is gathered and send it to the back-end django to be stored appropriately.

  View.py
    Here is where all the work on the back-end takes place. Here data is received from the javascript and stored into the model database. It is also where data from the model database is retrieved and sent back to the javascript via json.

Distinctiveness and Complexity

  Catagory listing
    I will start with the ordering of the catagories which house the different types of blogs. Depending on which topic a blog is written for it will end up in a different catagory. For example catagory of toys will have blog post about toys in someway. Selecting a catagory will send users to a list of blogs allowing one to choose which blog to read.

  Blog post
    After a catagory is selected a new list shows up with all the different blog posts that are related to the catagory topic. This allows users to choose which blog to read which leads to the blog entry the title is about.

  Blog entry
    When a user choose a blog to read they are then presented with the blog as well as the ability to like the blog and comment on the blog. But in order to do that a user must be signed in otherwise the user is instructed to sign in or sign up in order to leave a comment or even to leave a like.

  Like
    Is a button that allows users to like a post. It also keeps track of how many users have liked a particular post. As well as keeps track of who has liked a post. That way one user is not constantly liking a post. However this time the user will not have the ability to unlike a post. Meaning the user must be careful when liking a blog post.

  Comments
    Similar to like only users who are signed in are able to leave a like. What separates comment section from previous projects is that the comments are only toward the blog post and is monitored by the admin. For each comment that is left the user's name will be attached. However users can leave as many comments as they like.

  Users
    Anyone is able to view all the blog post and even the about page of the blogger. But in order to leave a comment or even like a post one must either sign in or sign up. There is no profile page for users to see likes or which blogs they have read.

Conclusion

This has been a very exciting opportunity to put into practice what I have learned and to build the confidence that I am able to build functioning websites.
