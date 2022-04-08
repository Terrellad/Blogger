import json, time
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt

from .models import *

def index(request):

    # Display content to html page index
    return render(request, "capstone/index.html")

def login_page(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "capstone/login.html", {
                "message": "Invalid username and/or password"
            })
    else:
        return render(request, "capstone/login.html")

def logout_page(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "capstone/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "capstone/register.html")

def catagory_view(cata_id):
    # Add code
    if request.method == "GET":
        try:
            cataPosts = CataPost.object.filter(cataID=cata_id)
        except CataPost.DoesNotExist:
            return JsonResponse({"error": "Sorry. No post in this catagory."}, status=404)
        cataPosts = cataPosts.order_by("timestamp").all()
        return JsonResponse([cataPost.serialize() for cataPost in cataPosts], safe=False)

    # Catagory_view must have GET or PUT
    else:
        return JsonResponse({"error": "GET or PUT request required."}, status=400)

def catagories_view(request):
    # Try to load all catagories
    try:
        catagoryLists = Catagory.objects.all()
    except Catagory.DoesNotExist:
        return JsonResponse(status=204)

    if catagoryLists != '':
        # Return Catagories
        return JsonResponse([catagoryList.serialize() for catagoryList in catagoryLists], safe=False)
    else:
        # Return empty
        return JsonResponse(status=204)

@login_required
def comment_view(request, id_post):
    # Method check GET
    if request.method == "GET":
        blogPost = Comment.objects.filter(commentPost=id_post)
        return HttpResponse(status=204)

    # Method check PUT
    elif request.method == "PUT":
        # Retrieve comment data
        data = json.loads(request.body)
        # See if user exist
        try:
            viewer = User.objects.get(username=data.get("user", ""))
        except User.DoesNotExist:
            if viewer != '':
                return JsonResponse({"error": "User does not exist."}, status=400)
        try:
            blogPost = CataPost.objects.get(id=id_post)
        except CataPost.DoesNotExist:
            return JsonResponse({"error": "Blog post does not exist."}, status=400)

        content = data.get("content", "")
        if content == '':
            return JsonResponse({"error": "No content available."}, status=400)

        # Create comment
        comment = Comment(
             commentPost = blogPost,
             commentUser = viewer,
             commentContent = content
        )
        # Save new comment
        comment.save()
        return HttpResponse(status=204)

    else:
        return JsonResponse({"error": "Unable to process. Needs to be a GET or PUT request."}, status=400)

def like_view(request, post_ID):
    # Retrieve data from post
    if request.method == "GET":
        try:
            likePost = Like.objects.get(
                likePostId=post_ID, user=request.user
            )
        except likePost.DoesNotExist:
            likePost = 0
            return JsonResponse(likePost, safe=False)
        # Return like data from model
        return JsonResponse(likePost.serialize())

    # Input data into post
    if request.method == "PUT":
        # Check post existence
        try:
            post = CataPost.objects.get(id=post_ID)
        except CataPost.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
        # Check is user has liked post
        try:
            user_like = User.objects.get(id=data.get("currentuser", ""))
        except User.DoesNotExist:
            return JsonResponse({"error": "No user found."}, status=404)
        # Place like in catapost
        try:
            like = Like.objects.get(postLiked=post_ID, user=user_like)
        except Like.DoesNotExist:
            new_like = Like(
                 user = user_like,
                 postLiked = post,
                 liked = 1
            )
            new_like.save()
            post.like = (post.like + 1)
            post.cata_liked = (post.like + 1)
            post.save()
            return HttpResponse(status=204)

        # Retrieve like from user
        likeCount = data.get("likecount", "")

        # Update user to reflex post liked & user like
        if likeCount == False:
            print("likeCount False.")
            like.liked = 0
            user.likecount = (user.likecount - 1)
            post.like = (post.like - 1)
            post.save()
            like.save()
            user.save()
        elif likeCount == True:
            print("likeCount True.")
            like.liked = 1
            user.likecount = (user.likecount + 1)
            post.like = (post.like + 1)
            post.save()
            like.save()
            user.save()

        return HttpResponse(status=204)

    # Post must be via PUT or GET
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=404)

def about_view(request, about_content):
    # If superuser visits about me.
    if request.user.is_superuser:
        try:
            user = User.objects.get(username=request.user)
        except User.DoesNotExist:
            try:
                user = User.objects.get(id=request.user)
            except IntegrityError:
                # Unknown failure
                if user == '':
                    return JsonResponse({"error": "Failed to authenticate."}, status=400)
                # Not superuser
                else:
                    logout(request)
                    return HttpResponseRedirect(reverse("login"))
        try:
            abouts = About.objects.all()
        except About.DoesNotExist:
            # Empty
            return HttpResponse(status=204)

        #successful return
        return JsonResponse([about.serialize() for about in abouts], safe=False)

    # Get about data
    elif request.method == "GET":
        try:
            check = About.objects.get(checkAbout=True)
        except IntegrityError:
            return httpResponse(status=204)
        try:
            abouts = About.objects.all()
        except About.DoesNotExist:
            return JsonResponse({"error": "Error in database."}, status=404)

        # Successful fetch
        return JsonResponse([about.serialize() for about in abouts], safe=False)

    # If method is PUT
    elif request.method == "PUT":
        # Check to see if about exist
        try:
            check = About.object.get(checkAbout=True)
        except About.DoesNotExist:
            # Store content
            new_about = About(
                  userAbout = request.user,
                  contentAbout = data.get("content", ""),
                  img = data.get("aboutImg", ""),
                  checkAbout = True
            )
            new_about.save()
            return HttpResponse(status=204)

        # Double check model
        try:
            about = About.objects.all()
        except About.DoesNotExist:
            return JsonResponse({"error": "Error in database."}, status=404)

        # Update existing data
        about.contentAbout = data.get("content", "")
        about.img = data.get("aboutImg", "")
        about.save()
        return HttpResponse(status=204)

    # If neither superuser, GET nor PUT
    else:
        return JsonResponse({
             "error": "Must be GET or PUT!"
        }, status=404)

def newBlog_view(request, user_name):

    # Authenticate superuser
    if request.user.is_superuser:
        try:
            Profile = User.objects.get(id=user_name)
        except:
            try:
                Profile = User.objects.get(username=user_name)
            except IntegrityError:
                if Profile == '':
                    return JsonResponse({"error": "Failed authentication."}, status=400)
        profileID = Profile.id

        # successful Return
        return render(request, "capstone/newBlog.html", {
             "Profile": profileID
        })

    # Not superuser
    else:
        logout(request)
        return HttpResponseRedirect(reverse("login"))
