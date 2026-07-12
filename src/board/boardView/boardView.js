import { loadHeader } from "../../components/header/header.js";
import { getUser, getUserId, getPostId } from "../../module/module.js";

loadHeader();


const postId = getPostId();
const boardViewProcess = async()=>{
    const userId = await getUserId();
    try{
        const response = await fetch(`http://localhost:8080/posts/${postId}`, {
            method: 'GET',
            credentials:"include",
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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
        const title = document.createElement('h3');
        title.id = "title";
        title.textContent =post.title;

        const user = await getUser(userId);
        const profilePicture= document.createElement('img');
        profilePicture.src = user?.profilePicture || '';//user.profilePicture;
        profilePicture.id = "postProfilePicture";

        const author = document.createElement('h4');   
        author.id = "postAuthor";
        author.textContent = post.author;

        const date = document.createElement('h4');
        date.id = "postUploadDate";
        date.textContent = post.createdAt;

        const postHeaderDiv = document.getElementById('postHeader')
        const postHeaderMeta = document.createElement('div');
        postHeaderMeta.classList.add('post-header-meta');
        postHeaderMeta.append(profilePicture, author, date);
        postHeaderDiv.append(title, postHeaderMeta)

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
    file.src = post.file || '' //post.file;

    const postContainerDiv = document.getElementById('postContainer');
    postContainerDiv.append(file, content)
}



boardViewProcess();

const postStatsLikeBtn = document.getElementById('postStatsLikeBtn')
let clickedLike = false;
function clickLikeBtn (){
    if(clickedLike){
        postStatsLikeBtn.style.backgroundColor = "#d9d9d9"
    }else if(!clickedLike){
        postStatsLikeBtn.style.backgroundColor = "#aca0eb"
    }
    clickedLike = !clickedLike;
}

postStatsLikeBtn.addEventListener('click', ()=>{
    clickLikeBtn();
})