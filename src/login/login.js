import { emailHelperTextMaker, pwdHelperTextMaker } from "../utils/helperTextMaker.js";

const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('loginBtn');

const emailHelperText = document.getElementById('emailHelperText');
const pwdHelperText = document.getElementById('pwdHelperText');

const emailInput = document.getElementById('email');

const validateEmailInput = (emailInput) =>{
    const helperText = emailHelperTextMaker(emailInput);
    emailHelperText.textContent = helperText;

    if(emailHelperText.textContent === "" && pwdHelperText.textContent === "") {
        loginBtn.disabled = false;
        loginBtn.style.backgroundColor="#1f4b22"
    }else{
        loginBtn.disabled = true;
        loginBtn.style.backgroundColor="#8fa58a"
    };

}

emailInput.addEventListener('input', ()=>{
    validateEmailInput(emailInput.value);
})

const pwdInput = document.getElementById('password');
const validatePwdInput = (pwdInput)=>{
    const helperText = pwdHelperTextMaker(pwdInput);
    pwdHelperText.textContent = helperText;

    if(emailHelperText.textContent === "" && pwdHelperText.textContent === "") {
        loginBtn.disabled = false;
        loginBtn.style.backgroundColor="#1f4b22"
    }else{
        loginBtn.disabled = true;
        loginBtn.style.backgroundColor="#8fa58a"
    };
}
pwdInput.addEventListener(('input'), ()=>{
    validatePwdInput(pwdInput.value);
})

loginForm.addEventListener('submit', (event) => {
    const emailValue = document.getElementById('email').value;
    const pwdValue = document.getElementById('password').value;
     
    validateEmailInput(emailValue);
    validatePwdInput(pwdValue);
});
