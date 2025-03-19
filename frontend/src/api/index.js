
const BASE_URI = "http://localhost:3001/api"


export async function getProducts() {
    try {
        const response = await fetch(BASE_URI + '/products');
        const result = await response.json();
        // const result = json.data;
        console.log(result.products)
        return result;
    }
    catch (error) {
        console.log(error);
    }

}
export async function getMoreDetails(id) {
    try {
        const response = await fetch(BASE_URI + `/products/${id}`);
        const json = await response.json();
        const result = json.product;
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

export async function handlePurchase(productId, available, token) {
    try {
        console.log(token)
        const response = await fetch(BASE_URI + `/products/${productId}`, {
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

export async function handleReturn(purchaseId, available, token) {
    try {
        console.log(token)
        const response = await fetch(BASE_URI + `/buys/${purchaseId}`, {
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

export async function loginUser({username, password}) {
    try {
        const response = await fetch(BASE_URI + "/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
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

export async function getPurchases(token) {
    try {
        const response = await fetch(BASE_URI + "/purchases", {
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





