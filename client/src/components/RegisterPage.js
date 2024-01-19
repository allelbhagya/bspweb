import { useState } from "react";

export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function register(ev){
        ev.preventDefault();
        const response = await fetch('https://bspweb-api.vercel.app/register', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        })
        if(response.status === 200){
            alert('registration sucessful');
        }
        else{
            alert("registration failed");
        }
    }
    return(
        <div>

            <form className="register" onSubmit={register}>
            <h2>register</h2>
                <input type="text" 
                placeholder="username" 
                value={username} 
                onChange={ev=>setUsername(ev.target.value)} />
                <input type="password" 
                placeholder="password"
                value ={password}
                onChange={ev=>setPassword(ev.target.value)} />
                <button>register</button>
            </form>
        </div>
    )
}