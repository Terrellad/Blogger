from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass
    likecount = models.IntegerField(default=0)
    followed_count = models.IntegerField(default=0)

    def serialize(self):
        return{
             "id": self.id,
             "username": self.username,
             "email": self.email,
             "like_count": self.likecount
        }

class Catagory(models.Model):
    cata = models.CharField(max_length=20)

    def serialize(self):
        return{
             "id": self.id,
             "cata": self.cata
        }

class CataPost(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="catapost_user")
    title = models.CharField(max_length=30)
    content = models.CharField(max_length=3000)
    like = models.IntegerField(default=0)
    liked = models.CharField(max_length=100)
    unliked = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return{
             "id": self.id,
             "cata_liked": self.user.likecount,
             "title": self.title,
             "content": self.content,
             "like": self.like,
             "liked": self.liked,
             "unliked": self.unliked,
             "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p")
        }

class Comment(models.Model):
    comment_post = models.ForeignKey("CataPost", on_delete=models.CASCADE, related_name="Comment_Post")
    comment_user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="Comment_user")
    comment_content = models.CharField(max_length=1500)
    comment_timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return{
             "commentPost": self.comment_post.id,
             "commentUser": self.comment_user.username,
             "commentContent": self.comment_content,
             "commentTimestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p")
        }

class Like(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="User_Like")
    liked = models.IntegerField(default=0)
    postLiked = models.ForeignKey("CataPost", null=True, blank=True, on_delete=models.PROTECT, related_name="post_liked")

    def serialize(self):
        return{
             "id": self.id,
             "user": self.user.username,
             "like": self.liked,
             "postLiked": self.catapost.like
        }

class About(models.Model):
    userAbout = models.ForeignKey("User", on_delete=models.CASCADE, related_name="User_About")
    contentAbout = models.CharField(max_length=3000)
    checkAbout = models.BooleanField(default=False)
    img = models.CharField(max_length=300)

    def serialize(self):
        return{
             "id": self.id,
             "userAbout": self.user.username,
             "checkAbout": self.checkAbout,
             "contentAbout": self.contentAbout,
             "img": self.img
        }
