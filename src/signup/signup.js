import { loadHeader } from "../components/header/header.js";
import { pfpHelperTextMaker, emailHelperTextMaker, pwdHelperTextMaker, confirmPwdHelperTextMaker, nicknameHelperTextMaker} from "../utils/helperTextMaker.js";

loadHeader();


const profilePictureInput = document.getElementById('profilePicture');
const pfpHelperText = document.getElementById('pfpHelperText');

const emailInput = document.getElementById('email');
const emailHelperText =document.getElementById('emailHelperText');

const passwordInput = document.getElementById('password');
const pwdHelperText = document.getElementById('pwdHelperText');

const confirmPwdInput = document.getElementById('confirmPassword');
const confirmPwdHelperText = document.getElementById('confirmPwdHelperText');

const nicknameInput = document.getElementById('nickname');
const nicknameHelperText = document.getElementById('nicknameHelperText');

const signupBtn = document.getElementById('signupBtn');

const checkAllInputFilled = () =>{
    if(profilePictureInput.value.length !== 0 
        && emailInput.value.length !== 0
        && passwordInput.value.length !== 0
        && confirmPwdInput.value.length !== 0
        && nicknameInput.value.length !== 0) {
          signupBtn.style.backgroundColor = "#7f6aee"
        }
    signupBtn.style.backgroundColor = "#aca0eb"
}

profilePictureInput.addEventListener('change', (event) =>{
    let helperTextMsg;
    if(event.target.files[0]?.name){
        helperTextMsg = pfpHelperTextMaker(event.target.files[0].name);
    }else{
        helperTextMsg = pfpHelperTextMaker(null)
    }
    pfpHelperText.textContent = helperTextMsg;
})

emailInput.addEventListener('input', ()=>{
    const helperTextMsg = emailHelperTextMaker(emailInput.value);
    emailHelperText.textContent = helperTextMsg;
    checkAllInputFilled()
})

passwordInput.addEventListener('input', () =>{
    const helperTextMsg = pwdHelperTextMaker(passwordInput.value, confirmPwdInput.value);
    pwdHelperText.textContent = helperTextMsg;
    checkAllInputFilled()
})

confirmPwdInput.addEventListener('input', () => {
    const helperTextMsg = confirmPwdHelperTextMaker(passwordInput.value, confirmPwdInput.value);
    confirmPwdHelperText.textContent = helperTextMsg;
    checkAllInputFilled()
})

nicknameInput.addEventListener('input', ()=>{
    const helperTextMsg = nicknameHelperTextMaker(nickname.value);
    nicknameHelperText.textContent = helperTextMsg;
    checkAllInputFilled()
})

signupBtn.addEventListener('click', async (event) => {

    try{
        const response = await fetch('http://localhost:8080/users/signup', {
            method: 'POST',
            credentials:"include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value,
                nickname: nicknameInput.value,
                profilePicture: profilePictureInput?.files[0]?.name
            })
        });

        if (!response.ok) {
            throw new Error('회원가입 실패');
        }

        const data = await response;
        console.log('회원가입 성공:', data);
        window.location.replace('../login/login.html');
    }catch(error){
        console.error('회원가입 중 오류 발생:', error);
    }
    
});
