import { loadHeader } from "../components/header/header.js";
import { formalizeDate } from "../module/module.js";

await loadHeader();

const postList = [];
const defaultPostImages = [
    "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1458560871784-56d23406c091?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
];
const defaultCategory = "일상";

showPostList();

async function getPostList  () {
    try{
        const response = await fetch('http://localhost:8080/posts', {
            method: 'GET',
            credentials:"include"        
        });

        if (!response.ok) {
            throw new Error('게시물 목록 조회 실패');
        }

        const data = await response.json();
        const posts = data?.data?.postList || [];
        posts.forEach(posts => {
            postList.push(posts);
        });
    } catch(error){
        console.error('오류 발생:', error);
    }
}

async function showPostList () {

    await getPostList();
    const postListContainer = document.getElementById('post-list-container');
    postListContainer.innerHTML = "";

    if (postList.length === 0) {
        return;
    }

    const postFragment = document.createDocumentFragment();

    postList.forEach((post, index)=>{
        postFragment.appendChild(makePostView(post, index));
    })

    postListContainer.appendChild(postFragment);
}

const makePostView = (post, index) =>{
    const postDiv = document.createElement("article");
    postDiv.classList.add('post-card');
    makePostClickEventListener(postDiv, post.id)

    const image = document.createElement('div');
    image.classList.add('post-card-image');
    image.style.backgroundImage = `url("${getPostImage(post, index)}")`;
    postDiv.append(image);

    const postMain = document.createElement('div');
    postMain.classList.add('post-card-main');

    const title = document.createElement('h3');
    title.classList.add('post-card-title');
    title.textContent = post.title || "제목 없는 기록";
    postMain.append(title);

    const meta = document.createElement('div');
    meta.classList.add('post-card-meta');

    const category = document.createElement('span');
    category.classList.add('post-card-category');
    category.textContent = post.category || defaultCategory;

    const stats = document.createElement('div');
    stats.classList.add('post-card-stats');

    const likes = document.createElement('span');
    likes.textContent = `좋아요 ${post.likes || 0}`;
    stats.append(likes);

    const commentCount = document.createElement('span');
    commentCount.textContent = `댓글 ${post.commentCount || 0}`;
    stats.append(commentCount);

    const views = document.createElement('span');
    views.textContent = `조회수 ${post.views || 0}`;
    stats.append(views);

    const date = document.createElement('span');
    date.classList.add('post-card-date');
    date.textContent = post.createdAt ? formalizeDate(post.createdAt) : "";

    meta.append(category, stats, date);
    postMain.append(meta);

    const authorWrapper = document.createElement('div');
    authorWrapper.classList.add('post-card-author');

    const profile = document.createElement('div');
    profile.classList.add('post-card-profile');

    const author = document.createElement('span');
    author.textContent = post.author || "익명";
    authorWrapper.append(profile, author);

    postDiv.append(postMain, authorWrapper);

    return postDiv;
}

const getPostImage = (post, index) => {
    if (post.file) {
        return post.file;
    }

    return defaultPostImages[index % defaultPostImages.length];
}

const makePostClickEventListener = (postDiv, postId)=>{
    postDiv.addEventListener('click' ,(event)=>{
        window.location.href = `./boardView/boardView.html?postId=${postId}`;
    }); 
}
