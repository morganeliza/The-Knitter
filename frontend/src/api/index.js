
const BASE_URI = "http://localhost:3001/api"


export async function getBooks() {
    try {
        const response = await fetch(BASE_URI + '/books');
        const result = await response.json();
        // const result = json.data;
        console.log(result.books)
        return result.books;
    }
    catch (error) {
        console.log(error);
    }

}
export async function getMoreDetails(id) {
    try {
        const response = await fetch(BASE_URI + `/books/${id}`);
        const json = await response.json();
        const result = json.book;
        console.log(json)
        return result;
    } catch (error) {
        console.log(error);
    }
}

export async function registerUser(user) {
    try {
        const response = await fetch(BASE_URI + "/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const json = await response.json();
        const result = json.user;
        console.log(json)
        return result;
    } catch (error) {
        console.log(error)
    }
}

export async function handleCheckout(bookId, available, token) {
    try {
        console.log(token)
        const response = await fetch(BASE_URI + `/books/${bookId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({available}),
        });
        const json = await response.json();
        console.log(json)
        return json;
    } catch (error) {
        console.log(error)
    }

}

export async function handleReturn(reservationId, available, token) {
    try {
        console.log(token)
        const response = await fetch(BASE_URI + `/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({available}),
        });
        const json = await response.json();
        console.log(json)
        return json;
    } catch (error) {
        console.log(error)
    }

}

export async function loginUser({email, password}) {
    try {
        const response = await fetch(BASE_URI + "/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });
        const json = await response.json();
        console.log(json)
        return json;
    } catch (error) {
        console.log(error)
    }
}

export async function userAccount(token) {
    try {
        const response = await fetch(BASE_URI + "/users/me", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            
        });
        const json = await response.json();
        console.log(json)
        return json;
    } catch (error) {
        console.log(error)
    }

}

export async function getReservations(token) {
    try {
        const response = await fetch(BASE_URI + "/reservations", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const json = await response.json();
        console.log(json)
        return json;
    } catch (error) {
        console.log(error)
    }

}





