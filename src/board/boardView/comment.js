import { getPostId, getUserId, getUser, formalizeDate } from "../../module/module.js";
const postCommentBtn = document.getElementById('postCommentBtn');
const postId = await getPostId();
const userId = await getUserId();

const commentEnterText = document.getElementById('commentContentEnter');
commentEnterText.addEventListener('input', ()=>{
    if(commentEnterText.value.length === 0){
        postCommentBtn.disabled = true;
        postCommentBtn.style.backgroundColor = "#aca0eb";
    } else if(commentEnterText.value.length !== 0 ){
        postCommentBtn.disabled = false;
        postCommentBtn.style.backgroundColor = "#7f6aee";
    }
})



postCommentBtn.addEventListener('click', async (event)=>{

    if(postCommentBtn.textContent === "댓글 등록"){
        postCommentEventListener();
    } else if(postCommentBtn.textContent === "댓글 수정"){
        updateCommentEventListener(event);
    }   
})

const updateCommentEventListener = async(event) =>{
    const cookie = await cookieStore.get('curUpdateCommentId');
    const commentId = cookie.value;
    const newContent = document.getElementById('commentContentEnter');
    try{
        const response = await fetch(`http://localhost:8080/posts/${postId}/comments/${commentId}`, {
            method: 'PATCH',
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: newContent.value,
            })
        });

        if (!response.ok) {
            throw new Error('댓글 수정 실패');
        }

        document.cookie = `curUpdateCommentId=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"`;
        location.reload();
    }catch(error){
        console.error('댓글 작성 중 오류 발생:', error);
    }
}

const postCommentEventListener = async () =>{
    const commentContentEnter = document.getElementById('commentContentEnter');

    try{
        const response = await fetch(`http://localhost:8080/posts/${postId}/comments/${userId}`, {
            method: 'POST',
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: commentContentEnter.value,
                createdAt : new Date()
            })
        });

        if (!response.ok) {
            throw new Error('댓글 작성 실패');
        }

        const data = await response.json();
        location.reload();
    }catch(error){
        console.error('댓글 작성 중 오류 발생:', error);
    }
}

const getCommentList = async (postId) => {
    try{
        const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
            method: 'GET',
            credentials:"include",
            
        });

        if (!response.ok) {
            throw new Error('로그인 실패');
        }

        const data = await response.json();
        data.data.commentsList.forEach(async (comment) => {
            await makeCommentView(comment, userId)
        });
    }catch(error){
        console.error('로그인 중 오류 발생:', error);
    }
}


getCommentList(postId);

const makeCommentView = async (comment, curUserId) =>{
    const user= await getUser(curUserId);
    const commentItem = document.createElement('article');
    commentItem.classList.add('comment-item');

    const profile = document.createElement('div');
    profile.classList.add('comment-profile');

    const meta = document.createElement('div');
    meta.classList.add('comment-meta');

    const author = document.createElement('h5');
    author.classList.add("comment-author-text");
    author.textContent = comment.author;

    const date = document.createElement('h6');
    date.classList.add('comment-date-text');
    date.textContent = formalizeDate(comment.createdAt);

    const content = document.createElement('h6');
    content.classList.add('comment-content-text');
    content.textContent = comment.content;

    const commentListContainer = document.getElementById('commentListContainer')
    meta.append(author, date);
    commentItem.append(profile, meta, content);
    
    if(curUserId == comment.userId) {
        const actionGroup = document.createElement('div');
        actionGroup.classList.add('comment-action-group');

        const updateBtn = document.createElement('button');
            updateBtn.id = "postUploadBtn";
            updateBtn.textContent = "수정";   
            updateBtn.onclick = () => requestUpdateComment(comment.id, comment.content);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.id = "postDeleteBtn";
            deleteBtn.textContent = "삭제"
            deleteBtn.addEventListener('click', async (event)=>{
                if(window.confirm("댓글을 삭제하시겠습니까?")){
                    await requestDeleteComment(event, comment.id);
                }
            })
            deleteBtn.onclick = ()=>{location.reload()};

        actionGroup.append(updateBtn, deleteBtn);
        commentItem.append(actionGroup);
    }

    commentListContainer.append(commentItem);
}

// function throwDeleteModal(){
    
// }

const requestDeleteComment = async (event, commentId) => {
     try{
        const response = await fetch(`http://localhost:8080/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            credentials:"include",        
        });

        if (!response.ok) {
            throw new Error('로그인 실패');
        }
        throwDeleteModal();
    }catch(error){
        console.error('로그인 중 오류 발생:', error);
    }
}

const requestUpdateComment = (commentId, content) =>{
    const commentContentEnter = document.getElementById('commentContentEnter');
    commentContentEnter.value = content;
    const commentUpdateBtn = document.getElementById('postCommentBtn');
    commentUpdateBtn.textContent = '댓글 수정'
    document.cookie = `curUpdateCommentId=${commentId};`
}
