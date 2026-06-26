const logoutItem = document.getElementById("logout-item");

logoutItem.addEventListener('click', ()=>{
    if(window.confirm("로그아웃 하시겠습니까?")){
        window.location.href = "../../login/login.html"
    } 
})