import { useState } from "react";
import { registerUser } from "../api";

export default function Register({ setToken }) {


    const [firstname, setFirstName] = useState(null);
    const [lastname, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);



    async function handleSubmit(e) {
        e.preventDefault();

        const user = { firstname, lastname, username, password }
        const response = await registerUser(user);
        localStorage.setItem('token', response.token);
        setToken(response.token)

    }

    return (

        <form onSubmit={handleSubmit}>
            <input
                value={firstname}
                type="text"
                name="firstname"
                placeholder="First Name"
                onChange={(e) =>
                    setFirstName(e.target.value)
                }
                required
            />

            <input
                value={lastname}
                type="text"
                name="lastname"
                placeholder="Last Name"
                onChange={(e) =>
                    setLastName(e.target.value)
                }
                required
            />

            <input
                value={username}
                type="text"
                name="username"
                placeholder="Username"
                onChange={(e) =>
                    setUsername(e.target.value)
                }
            />

            <input
                value={password}
                type="text"
                name="password"
                placeholder="Password"
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button className="submit" type="submit">
                Submit
            </button>
        </form>


    )
}

