import { emailHelperTextMaker, pwdHelperTextMaker } from "../utils/helperTextMaker.js";
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('loginBtn');

const emailHelperText = document.getElementById('emailHelperText');
const pwdHelperText = document.getElementById('pwdHelperText');

const emailInput = document.getElementById('email');
const validateEmailInput = (emailInput) =>{
    const helperText = emailHelperTextMaker(emailInput);
    emailHelperText.textContent = helperText;

    if(emailHelperText.value === "" && pwdHelperText.value === "") {
        loginBtn.disabled = false;
        loginBtn.style.backgroundColor="#7f6aee"
    }else{
        loginBtn.disabled = true;
        loginBtn.style.backgroundColor="#aca0eb"
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
        loginBtn.style.backgroundColor="#7f6aee"
    }else{
        loginBtn.disabled = true;
        loginBtn.style.backgroundColor="#aca0eb"
    };
}
pwdInput.addEventListener(('input'), ()=>{
    validatePwdInput(pwdInput.value);
})

loginBtn.addEventListener('click', async (event) => {
    const emailInput = document.getElementById('email').value;
    const pwdInput = document.getElementById('password').value;
     
    validateEmailInput(emailInput);
    validatePwdInput(pwdInput);
    
    try{
        const response = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput,
                password: pwdInput
            })
        });

        if (!response.ok) {
            throw new Error('로그인 실패');
        }

        const data = await response.json();
        document.cookie = `userId = ${data.data.id}; Path=/`
        
        window.location.href = '../board/board.html';
    }catch(error){
        console.error('로그인 중 오류 발생:', error);
    }
});

