import { getUserId } from "../../module/module.js";

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

        logoutItem?.addEventListener('click', () => {
            if (window.confirm("로그아웃 하시겠습니까?")) {
                window.location.href = "/src/login/login.html";
            } 
        });
    }
};

const setProfileImage = async (profileImage) => {
    const storedProfileImage = localStorage.getItem("profilePicture");

    if (storedProfileImage && storedProfileImage !== "undefined") {
        profileImage.src = storedProfileImage;
        return;
    }

    try {
        const userId = await getUserId();
        console.log(userId)
        if (!userId) {
            return;
        }

        const response = await fetch(`http://localhost:8080/users/${userId}/profilePicture`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        profileImage.src = storedProfileImage;
        console.log(profileImage)

    } catch (error) {
        console.error("프로필 이미지 로딩 중 오류 발생:", error);
    }
};
