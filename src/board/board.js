const postList = [];
showPostList();

async function getPostList  () {
    try{
        const response = await fetch('http://localhost:8080/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            
        });

        if (!response.ok) {
            throw new Error('로그인 실패');
        }

        const data = await response.json();
        data.data.postList.forEach(posts => {
            postList.push(posts);
        });
    }catch(error){
        console.error('로그인 중 오류 발생:', error);
    }
}

async function showPostList () {

    await getPostList();
    postList.forEach((post)=>{
        makePostView(post)
    })
   
    // postContainer[0].addEventListener('click' ,(event)=>{
    //     window.location.href = "./boardView/boardView.html";
    // });
}

const makePostView = (post) =>{
 const postDiv = document.createElement("div");
    postDiv.classList.add('common-container');

    const title = document.createElement('h3');
    title.id ="postListTitle"
    title.textContent = post.title;
    postDiv.append(title)

    const likes = document.createElement('h4');
    likes.id ="postListLikes"
    likes.textContent = `좋아요 ${0}`;
    postDiv.append(likes)

    const commentCount = document.createElement('h4');
    commentCount.id ="postListCommentCount"
    commentCount.textContent = `댓글 ${0}`;
    postDiv.append(commentCount)

    const views = document.createElement('h4');
    views.id ="postListViews"
    views.textContent = `조회수 ${0}`;
    postDiv.append(views)

    const date = document.createElement('h4');
    date.id = "postListDate"
    date.textContent = post.createdAt
    postDiv.append(date)

    const author = document.createElement('h4');
    author.id = "postListAuthor"
    author.textContent = post.author;
    postDiv.append(author)

    document.body.appendChild(postDiv);
}