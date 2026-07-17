import { getUserId } from "../../module/module.js";
import { deleteCookie } from "../../api/deleteCookie.js";
import { requestCsrfAPIJsonResponse } from "../../api/csrf.js";

export const loadHeader = async () => {
    try {
        const response = await fetch('/src/components/header/header.html');

        if (!response.ok) {
            throw new Error('헤더를 불러오지 못했습니다.');
        }

        const headerHtml = await response.text();
        const headerContainer = document.getElementById('headerContainer');
        headerContainer.innerHTML = headerHtml;
    } catch (error) {
        console.error('헤더 로딩 중 오류 발생:', error);
    } finally {
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.href = "/src/assets/raffine_favicon.ico";
        document.head.appendChild(favicon);
        
        const profileToggleBtn = document.getElementById("profileToggleBtn");
        const profileImage = document.getElementById("headerProfilePicture");
        const mypageToggleContainer = document.querySelector(".mypage-toggle-container");
        const backBtn = document.getElementById("backBtn");
        const logoutItem = document.getElementById("logoutItem");

        await setProfileImage(profileImage);

        backBtn?.addEventListener('click', () => {
            history.back();
        });

        profileToggleBtn?.addEventListener('click', () => {
            if (mypageToggleContainer) {
                mypageToggleContainer.hidden = !mypageToggleContainer.hidden;
            }
        });

        logoutItem?.addEventListener('click', async() => {
            if (window.confirm("로그아웃 하시겠습니까?")) {
                const response = await deleteCookie();
                if(response === 204) window.location.replace("/src/login/login.html");
            } 

        });
    }
};

const setProfileImage = async (profileImage) => {
    const storedProfileImage = localStorage.getItem("profilePicture");
    if (storedProfileImage && storedProfileImage !== null) {
        profileImage.src = storedProfileImage;
        return;
    }
    
    try {
        const userId = await getUserId();
        if (!userId) {
            return;
        }

        const response = await fetch(`http://localhost:8080/users/${userId}/profilePicture`, {
            method: "GET",
            credentials:"include"
        });

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        
        const profilePictureData = data?.data?.profilePicture;

        if (profilePictureData) {
            profileImage.src = profilePictureData;
            localStorage.setItem("profilePicture", profilePictureData);
        }

    } catch (error) {
        console.error("프로필 이미지 로딩 중 오류 발생:", error);
    }
};
