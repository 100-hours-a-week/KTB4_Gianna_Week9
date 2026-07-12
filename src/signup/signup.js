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
            signupBtn.disabled = false;
            signupBtn.style.backgroundColor = "#7f6aee"
    } else{
            signupBtn.disabled = true;
            signupBtn.style.backgroundColor = "#aca0eb"
        }                                       
}

profilePictureInput.addEventListener('change', (event) =>{
    pfpHelperText.textContent = pfpHelperTextMaker(event.target.files[0].name);
    checkAllInputFilled()
})

emailInput.addEventListener('input', ()=>{
    emailHelperText.textContent = emailHelperTextMaker(emailInput.value);
    checkAllInputFilled()
})

passwordInput.addEventListener('input', () =>{
    pwdHelperText.textContent = pwdHelperTextMaker(passwordInput.value, confirmPwdInput.value);
    if(confirmPwdHelperText.textContent !== "") confirmPwdHelperText.textContent = confirmPwdHelperTextMaker(passwordInput.value, confirmPwdInput.value);

    checkAllInputFilled()
})

confirmPwdInput.addEventListener('input', () => {
    if(pwdHelperText.textContent !== "") pwdHelperText.textContent = pwdHelperTextMaker(passwordInput.value, confirmPwdInput.value);
    confirmPwdHelperText.textContent = confirmPwdHelperTextMaker(passwordInput.value, confirmPwdInput.value);
   checkAllInputFilled()
})

nicknameInput.addEventListener('input', ()=>{
    nicknameHelperText.textContent = nicknameHelperTextMaker(nickname.value);
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
        console.log('회원가입 성공:');
        window.location.replace('../login/login.html');
    }catch(error){
        console.error('회원가입 중 오류 발생:', error);
    }
    
});
