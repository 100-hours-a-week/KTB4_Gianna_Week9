import { loadHeader } from "../components/header/header.js";
import { pwdHelperTextMaker, confirmPwdHelperTextMaker } from "../utils/helperTextMaker.js";

loadHeader();

const pwdInput = document.getElementById('passwordInput');
const pwdHelperText = document.getElementById('pwdHelperText');

const pwdCheckInput = document.getElementById('passwordInputCheck');
const pwdCheckHelperText = document.getElementById('pwdCheckHelperText');

const updatePwdBtn = document.getElementById('updatePwdBtn');
updatePwdBtn.disabled = true;
function checkPwdValid(){
    if(pwdInput.value === pwdCheckInput.value){
        updatePwdBtn.disabled = false;
        updatePwdBtn.style.backgroundColor = "#7f6aee"
    }else{
        updatePwdBtn.disabled = true;
        updatePwdBtn.style.backgroundColor = "#aca0eb"
    }
}

pwdInput.addEventListener('input', ()=>{
    const helperText = pwdHelperTextMaker(pwdInput.value, pwdCheckInput.value);

    pwdHelperText.textContent= helperText        
    checkPwdValid();
})

pwdCheckInput.addEventListener('input', ()=>{
    const helperText = confirmPwdHelperTextMaker(pwdInput.value, pwdCheckInput.value);
    pwdCheckHelperText.textContent = helperText;
    checkPwdValid();
})

const requestUpdatePwd = async ()=>{
    const cookie = await cookieStore.get('userId');
    const curUserId = cookie.value;
    try{
        const response = await fetch(`http://localhost:8080/users/${curUserId}/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: pwdInput.value,
            })
        });

        if (!response.ok) {
            throw new Error('비밀번호 업데이트 실패');
        }

        const data = await response.json();
        if(!data.data){
            const existingToastMsg = document.getElementById('pwdUpdateSuccessToastMsg');
            if (existingToastMsg) {
                existingToastMsg.remove();
            }

            const toastMsg = document.createElement('h5');
            toastMsg.classList.add("toastMsg");
            toastMsg.id = "pwdUpdateSuccessToastMsg"
            toastMsg.textContent ="수정완료";

            const changePwdForm = document.getElementById('changePwdForm');
            changePwdForm.append(toastMsg)
            setTimeout(()=>{window.location.replace('/src/board/board.html')}, 3000)
        }
    }catch(error){
        console.error('비밀번호 변경 중 오류 발생:', error);
    }
}

updatePwdBtn.addEventListener('click', async ()=>{
    if(pwdInput.value !== pwdCheckInput.value){
    pwdHelperText.textContent = "*비밀번호 확인과 다릅니다."
    pwdCheckHelperText.textContent = "*비밀번호와 다릅니다."
}

    if(pwdInput.value === pwdCheckInput.value){
    requestUpdatePwd();
}
})
