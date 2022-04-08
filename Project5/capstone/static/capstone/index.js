// When DOM loads, render catagories of posts
document.addEventListener('DOMContentLoaded', function() {

  // Load about page
  about_page();

  // Save comments on posts
  comment_post();

  // Load catagories
  catagory_list();
});

function comment_post() {
  // Add comment when
  document.querySelector('form').onsubmit = function() {

    // Check if comment exist
    if(document.querySelector('#BlogCommentText').value !== ''){
      // Temporarily store content and user values
      const commentor = document.querySelector('#BlogViewer').value;
      const content = document.querySelector('#BlogCommentText').value;
      const id_post = document.querySelector('#PostID').value;

      // Save content through fetch
      fetch(`/comment/${id_post}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: `${id_post}`,
          user: `${commentor}`,
          commentPost: `${content}`
        })
      })
      .then(response => response.json())
      .then(test => {
        console.log(test);
      })

      // Clear temporary values
      document.querySelector('#BlogViewer').value = '';
      document.querySelector('#BlogCommentText').value = '';

      // Refresh page
      window.setTimeout(refreshpage, 1000);
      return false;
    }
    else{
      return JsonResponse({"message": "Please add words to your comment before submitting."}, status=404);
    }
  };
}

function catagory_list() {

  // Display catagories
  document.querySelector('#Main').style.display = 'block';
  document.querySelector('#Catagory_Post').style.display = 'none';
  document.querySelector('#Post').style.display = 'none';
  document.querySelector('#About').style.display = 'none';
  document.querySelector('#New_Comment').style.display = 'none';
  document.querySelector('#Blog_Comment').style.display = 'none';

  // Clear main page at each load
  document.querySelector('#Main').innerHTML = '';

  // Retrieve all catagories
  fetch(`/catagory`)
  .then(response => response.json())
  .then(lists => {

    // Create ul element
    const ul = document.createElement('ul');
    ul.className = "list-group";

    // Check if lists is empty
    if(lists == 'undefined' || lists == ''){
      const li = document.createElement('li');
      li.innerHTML = `<h2>Sorry, No catagories as of yet. Try again later!</h2>`;
      li.className = "list-group-item";

      ul.appendChild(li);

      document.querySelector('#Main').append(ul);
    }
    else{
      lists.forEach(lists => {

        // Create li element
        const li = document.createElement('li');
        li.className = "list-group-item";

        // List elements
        const cat_title = document.createElement('div');
        cat_title.innerHTML = `<a id="catTitle" onclick="cat_Post(${lists.id})"><strong>${lists.title}</strong></a>`;
        cat_title.className = "catTitle";
        const cat_image = document.createElement('div');
        cat_image.innerHTML = `<a id="catImage" onclick="cat_Post(${lists.id})"><img class="center" src="(add code)" width="40%" height="30%" class="d-inlin-block align-top" alt=""></a>`;
        cat_image.className = "catImage";

        // Create list
        li.append(catTitle,catImage);
        li.setAttribute("id", `${lists.id}`);

        ul.appendChild(li);
        ul.setAttribute("id", 'catList');

        // Display catagory
        document.querySelector('#Main').append(ul);
      })
    }
  });
}

function cat_Post(list_id) {

  // Display catagory selected
  document.querySelector('#Main').style.display = 'none';
  document.querySelector('#Catagory_Post').style.display = 'block';
  document.querySelector('#Post').style.display = 'none';
  document.querySelector('#About').style.display = 'none';
  document.querySelector('#New_Comment').style.display = 'none';
  document.querySelector('#Blog_Comment').style.display = 'none';

  // Test if cat_Item is called
  console.log('cat_Item called');

  // Clears the catagory post div
  document.querySelector('#Catagory_Post').innerHTML = '';

  // fetch for post in catagory
  fetch(`/post/${list_id}`)
  .then(response => response.json())
  .then(posts => {

    // Create ul for post
    const posts_ul = document.createElement('ul');
    posts_ul.className = "list-group";

    posts.forEach(posts => {

      // Create li for post
      const posts_li = document.createElement('li');
      posts_li.className = "list-group-item";

      // List elements
      const title = document.createElement('div');
      title.innerHTML = `<a id="postTitle" onclick="load_post(${posts.id})"><strong>${posts.title}</strong></a>`;
      title.className = "col-3";
      const image = document.createElement('div');
      image.innerHTML = `<img id="postImage" onclick="load_post(${posts.id})" src="/media/${posts.img}" width="15" heigth="10" class="d-inline-block align-top" alt=""></img>`;
      image.className = "img-3";
      const timestamp = document.createElement('div');
      timestamp.innerHTML = `${posts.timestamp}`;
      timestamp.className = "time";

      // Place all elements in the li
      posts_li.append(title, image, timestamp);
      posts_li.setAttribute("id", `${posts.id}`);

      // Place li into the ul
      posts_ul.appendChild(posts_li);
      posts_ul.setAttribute("id", 'postsList');

      // Display post
      document.querySelector('#Catagory_Post').append(posts_ul);
    })
  });
}

function load_post(post_id) {

  // Display post
  document.querySelector('#Main').style.display = 'none';
  document.querySelector('#Catagory_Post').style.display = 'none';
  document.querySelector('#Post').style.display = 'block';
  document.querySelector('#About').style.display = 'none';
  document.querySelector('#New_Comment').style.display = 'block';
  document.querySelector('#Blog_Comment').style.display = 'block';

  // Obtain user
  const currentUser = document.querySelector('#UserId').value;

  // Retrieve post
  fetch(`/post/${post_id}`)
  .then(response => response.json())
  .then(post => {

    // Show post
    const postId = document.createElement('div');
    postId.innerHTML = `<input type="hidden" id="PostID" value="${post.id}">`;
    postId.className = "col-3";
    const post_title = document.createElement('div');
    post_title.innerHTML = `${post.title}`;
    post_title.className = "col-3";
    const post_timestamp = document.createElement('div');
    post_timestamp.innerHTML = `${post.timestamp}`;
    post_timestamp.className = "time";
    const post_content = document.createElement('div');
    post_content.setAttribute("contenteditable", 'true');
    post_content.innerHTML = `${post.content}`;
    post_content.className = "col-9";
    const post_like = document.createElement('div');
    post_like.setAttribute("id", 'like');
    post_like.setAttribute("class", 'likepopup');

    // Find if user has already liked post
    fetch(`/like/${post.id}`)
    .then(response => response.json())
    .then(post_like => {

      // Change like status
      if(`${post_like.like}` == '1' || `${post_like.like}` == '0'){
        post_like = post_like.like;
      }
      else{
        post_like = '0';
      }

      // Change like status
      if(`${currentUser}` == '' || `${currentUser}` == 'undefined'){
        post_like.innerHTML = `<a href="#" id="likePost"><img id="likePostImg" onclick="warning_popup()" src="/media/${post.img}" width="15" height="15" class="d-inline-block align-top" alt=""></img>Like</a>
                               <span class="popuptext" id="PopUp">Must signin in order to like this great post</span>`;
      }
      else if(`${currentUser}` != `${post.user}`){
        if(`${post.like}` != '0' && `${post_like}` != '0'){
          post_like.innerHTML = `<img id="likePostImg" onclick="like_Post(${post.id},false)" src="/media/${post.liked}" width="15" height="15" class="d-inline-block align-top" alt=""></img>${post.like}`;
        }
        else if(`${post.like}` != '0'){
          post_like.innerHTML = `<img id="likePostImg" onclick="like_Post(${post.id},true)" src="/media/${post.unliked}" width="15" height="15" class="d-inline-block align-top" alt=""></img>${post.like}`;
        }
        else{
          post_like.innerHTML = `<img id="likePostImg" onclick="like_Post(${post.id},true)" src="/media/${post.img}" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
        }
      }
      else{
        if(`${post.like}` != '0'){
          post_like.innerHTML = `<img id="likePostImg" src="/media/${post.unliked}" width="15" height="15" class="d-inline-block align-top" alt=""></img>${post.like}`;
        }
        else{
          post_like.innerHTML = `<img id="likePostImg" src="/media/${post.img}" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
        }
      }
    });

    // Fetch for comments
    fetch(`/comment/${post.id}`)
    .then(response => response.json())
    .then(comments => {

      // Create ul
      const com_ul = document.createElement('ul');
      com_ul.className = "list-group";

      // Loops through comments
      comments.forEach(comments =>{
        // Create li
        const com_li = document.createElement('li');
        com_li.className = "list-group-item";

        // List for post
        const com_viewer = document.createElement('div');
        com_viewer.innerHTML = `${comments.commentUser}`;
        com_viewer.className = "col-3";
        const com_time = document.createElement('div');
        com_time.innerHTML = `${comments.commentTimestamp}`;
        com_time.className = "time";
        const com_content =  document.createElement('div');
        com_content.innerHTML = `${comments.commentContent}`;
        com_content.classHTML = "col-9";

        // Add items to list
        com_li.append(com_viewer,com_time,com_content);

        // Add li to ul
        com_ul.appendChild(li);
      })
    });

    // Wait for API to respond
    window.setTimeout(function(){
      // Display post
      document.querySelector('#Post').append(post_title,post_timestamp,post_content,post_like);
    }, 500);
  });
}

function like_Post(post_Id,value){

  // Get current user
  const current_user = document.querySelector('#UserId').value;

  // Find post
  fetch(`/post/${post_Id}`)
  .then(response => response.json())
  .then(post_like => {

    // Change like status on post
    if(`${post_like.like}` >= '1' && `${value}` == 'true'){
      fetch(`/like/${post_like.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          currentuser: `${currentUser}`,
          likecount: true
        })
      })
    }

    // Wait for API to respond
    window.setTimeout(refreshpage, 1000);
  });
}

function refreshpage(){
  // Refresh page
  window.location.reload();
}

function warning_popup(){
  // Popup signin warning
  var likePopup = document.getElementById('PopUp');
  likePopup.classList.toggle("show");
}

function about_page(value,userName){

  // Check if about tab is clicked on from other users
  if(`${value}` == 'Aboutpage') {
    // Display proper block
    document.querySelector('#Main').style.display = 'none';
    document.querySelector('#Catagory_Post').style.display = 'none';
    document.querySelector('#Post').style.display = 'none';
    document.querySelector('#About').style.display = 'block';
    document.querySelector('#New_Comment').style.display = 'none';
    document.querySelector('#Blog_Comment').style.display = 'none';

    // Send skip for GET to recieve about data
    const skip = "skip";

    // Fetch information from database
    fetch(`/about_me/${skip}`)
    .then(response => response.json())
    .then(about => {

      // Create ul
      const about_ul = document.createElement('ul');
      about_ul.className = "list-group";

      // Create li items
      const about_li = document.createElement('li');
      about_li.className = "list-group-item";

      // ** Add img location **
      const about_img = createElement('div');
      about_img.innerHTML = `<img id="AboutImage" src="/media/${about.img}" width="20" height="20" class="d-inline-block align-top" alt=""></img>`;
      about_lmg.className = "img-3";

      const about_content = createElement('div');
      about_content.innerHTML = `${about.contentAbout}`;
      about_content.className = "col-3";

      // Place li into ul
      about_ul.appendChild(about_li);
      about_ul.setAttribute("id", 'AboutMe');

      // Display to HTML page
      document.querySelector('#About').append(about_ul);
    });
  };

  // If superuser clicks on aboutMe
  if(`${value}` == 'Edit_About') {

    // AboutMe called
    console.log("AboutMe called.");

    // Display proper block
    document.querySelector('#Main').style.display = 'none';
    document.querySelector('#Catagory_Post').style.display = 'none';
    document.querySelector('#Post').style.display = 'none';
    document.querySelector('#About').style.display = 'block';
    document.querySelector('#New_Comment').style.display = 'none';
    document.querySelector('#Blog_Comment').style.display = 'none';

    // Send skip for GET to recieve about data
    const skip = "skip";

    // Fetch about data for editing
    fetch(`/about_me/${skip}`)
    .then(response => response.json())
    .then(editAbout => {

      console.log(`Test edit value before if statement:${editAbout.contentAbout}`);

      // Use if to check for value of editAbout
      if (`${editAbout.contentAbout}` != 'undefined') {

        // * Figure out what is wrong *
        console.log(`Called: ${editAbout.contentAbout}`)

        // Pre-fill text from model
        document.querySelector('#About').innerHTML = `<h3>Edit About</h3>
        <form name="AboutEditForm" id="AboutEditForm">
            <input type="hidden" id="User" value="${editAbout.userAbout}">
            <img id="AboutEditImg" src="/media/${editAbout.img}" width="25" height="25" class="d-inline-block align-top" alt=""></img>
            <br>
            <textarea id="AboutEditText" class="textstyle">${editAbout.contentAbout}</textarea>
            <button class="btn btn-sm btn-outline-secondary" id="AboutEdit">Save</button>
        </form>`;
      }
      else{

        // Test two see if else is called.
        console.log('Called: else.');
        // Fill text from model
        document.querySelector('#About').innerHTML = `<h3>Write About yourself</h3>
        <form name="AboutEditForm" id="AboutEditForm"><br>
            <input type="hidden" id="User" value="${userName}">
            <label for="imgUpload">Upload image here.</label><br>
            <input type="file" name="imgUpload" id="imgUpload"><br><br>
            <label for="AboutEditText">Delineate yourself here.</label><br>
            <textarea id="AboutEditText" class="textstyle" rows="30%" cols="80%" placeholder="All good things, all good things..."></textarea><br>
            <button class="btn btn-sm btn-outline-secondary" id="AboutEdit">Save</button>
        </form>`;
      }

      // Submitting blog
      document.querySelector('#About').onsubmit = function() {

        // Temporarily store data
        const aboutImg = document.querySelector('#AboutEditImg').value;
        const content = document.querySelector('#AboutEditText').value;

        // Save to database
        fetch(`/about_me/${editAbout.userAbout}`,{
          method: 'PUT',
          body: JSON.stringify({
            contentAbout: `${content}`,
            img: `${aboutImg}`
          })
        })

        // Wait for API to return
        //window.setTimeout(refreshpage, 1000)
        //return false;
      };
    });
  };
}
