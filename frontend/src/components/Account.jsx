import { useState, useEffect } from "react";
import { requireUser } from "../api";
import { getProductsByUser} from "../db";

export default function Account() {
  const [member, setMember] = useState(null);
  const [shoppingCarts, setShoppingCarts] = useState(null);

  const userInfo = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await requireUser(token);
      setMember(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMemberLogin = async () => {
      const token = localStorage.getItem("token");

      const response = await getProductsByUser(token);
      setShoppingCarts(response.shoppingCart);
    };
    userInfo();
    getMemberLogin();
  }, []);

  const returnproduct = async (shoppingCartId) => {
   
    const token = localStorage.getItem("token");
    const returnProductResponse = await handleReturn(
      shoppingCartId,
      token
    );
  };

  return (
    <>
      {member && <span>{member.firstname} {member.lastname}</span>}



      {shoppingCarts &&
        shoppingCarts.map((shoppingCart) => (
          <div className="productdetails">
            <img className="imagedetails" src={shoppingCart.image_url} />
            <h1>{shoppingCart.name}</h1>
            <button
              className="returnproduct"
              onClick={() =>
                returnproduct(shoppingCart.id, !shoppingCart.unavailable)
              }
            >
              Return Yarn
            </button>
          </div>
        ))}
    </>
  );
}