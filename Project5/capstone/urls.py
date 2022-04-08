
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_page, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_page, name="logout"),
    path("new_blog/<str:user_name>", views.newBlog_view, name="new_blog"),

    # API Routes
    path("catagory", views.catagories_view, name="catagories"),
    path("catagory/<int:cata_id>", views.catagory_view, name="catagory"),
    path("like/<int:post_id>", views.like_view, name="like"),
    path("about_me/<str:about_content>", views.about_view, name="about"),
    path("comment/<int:id_post>", views.comment_view, name="comment")
]
