const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('loginBtn');

const loginInput = document.getElementById('email');
const pwdInput = document.getElementById('password');

loginBtn.addEventListener('click', async (event) => {
    
    try{
        const response = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginInput.value,
                password: pwdInput.value
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
