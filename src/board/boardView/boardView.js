import { loadHeader } from "../../components/header/header.js";
import { getUser, getUserId, getPostId } from "../../module/module.js";
import { requestCsrfAPIJsonResponse } from "../../api/csrf.js";

loadHeader();


const postId = getPostId();
const csrf = await requestCsrfAPIJsonResponse();
const defaultPicture = "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80";

const backBtn = document.getElementById("backBtn");
backBtn?.addEventListener('click', () =>{
    window.location.href ="/src/board/board.html"
});

const boardViewProcess = async()=>{
    const userId = await getUserId();
    try{
        const response = await fetch(`http://localhost:8080/posts/${postId}`, {
            method: 'GET',
            credentials:"include",
            headers: {
                'Content-Type': 'application/json',
                [csrf.headerName] : csrf.token
            },
        });

        if (!response.ok) {
            throw new Error('게시물 상세 조회 실패');
        }

        const data = await response.json();
        await makePostViewHeader(data.data, userId)
        makePostViewContent(data.data);
    }catch(error){
        console.error('boardView 오류 발생:', error);
    }
};

const deletePost = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/posts/${postId}`, {
            method: 'DELETE',
            credentials:"include",
            headers: {
                'Content-Type': 'application/json',
                [csrf.headerName] : csrf.token
            },
        });

        if (!response.ok) {
            throw new Error('게시물 상세 조회 실패');
        }
    }catch(error){
        console.error('boardView 오류 발생:', error);
    }
}

const makePostViewHeader = async (post, userId) =>{
        const category = document.createElement('p');
        category.id = "postCategory";
        category.textContent = `${post.category || "일상"} · ${post.author || "익명"}`;

        const title = document.createElement('h3');
        title.id = "title";
        title.textContent = post.title;

        const user = await getUser(userId);
        const profilePicture= document.createElement('img');
        profilePicture.src = user?.profilePicture || '';//user.profilePicture;
        profilePicture.id = "postProfilePicture";

        const author = document.createElement('h4');   
        author.id = "postAuthor";
        author.textContent = post.author || "익명";

        const date = document.createElement('h4');
        date.id = "postUploadDate";
        date.textContent = post.createdAt;

        const postHeaderDiv = document.getElementById('postHeader')
        const postHeaderMeta = document.createElement('div');
        postHeaderMeta.classList.add('post-header-meta');
        postHeaderMeta.append(profilePicture, author, date);
        postHeaderDiv.append(category, title, postHeaderMeta)

        if(userId == post.userId){
            const actionGroup = document.createElement('div');
            actionGroup.classList.add('post-action-group');

            const updateBtn = document.createElement('button');
            updateBtn.id = "postUploadBtn";
            updateBtn.textContent = "수정";   
            updateBtn.addEventListener('click', ()=> window.location.href= `../boardWrite/boardWrite.html?postId=${postId}`);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.id = "postDeleteBtn";
            deleteBtn.textContent = "삭제"
            deleteBtn.addEventListener('click', async()=>{ 
                if(window.confirm("게시글을 삭제하시겠습니까?")) {
                    await deletePost();}
                    window.location.href ="/src/board/board.html";
                })

            
            actionGroup.append(updateBtn, deleteBtn);
            postHeaderDiv.append(actionGroup)
        }        
}



const makePostViewContent = (post) =>{
    const content = document.createElement('h6');
    content.id = "postContent"
    content.textContent = post.content;

    const file = document.createElement('img');
    file.id = "postViewFile";
    file.src = post.file || defaultPicture;
    file.alt = post.title || "게시글 이미지";

    const postContainerDiv = document.getElementById('postContainer');
    postContainerDiv.append(file, content)
}



boardViewProcess();

const postStatsLikeBtn = document.getElementById('postStatsLikeBtn')
let clickedLike = false;
function clickLikeBtn (){
    if(clickedLike){
        postStatsLikeBtn.style.backgroundColor = "#f0f0ef"
    }else if(!clickedLike){
        postStatsLikeBtn.style.backgroundColor = "#dce8d8"
    }
    clickedLike = !clickedLike;
}

postStatsLikeBtn.addEventListener('click', ()=>{
    clickLikeBtn();
})
