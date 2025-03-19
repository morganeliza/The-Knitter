import { useState, useEffect } from "react";
import { userAccount } from "../api";
import { getPurchases, handleReturn} from "../api";

export default function Account() {
  const [member, setMember] = useState(null);
  const [purchases, setPurchases] = useState(null);

  const userInfo = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await userAccount(token);
      setMember(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMemberLogin = async () => {
      const token = localStorage.getItem("token");

      const response = await getPurchases(token);
      setPurchases(response.purchase);
    };
    userInfo();
    getMemberLogin();
  }, []);

  const returnproduct = async (purchaseId, available) => {
   
    const token = localStorage.getItem("token");
    const returnProductResponse = await handleReturn(
      purchaseId,
      available,
      token
    );
  };

  return (
    <>
      {member && <span>{member.firstname} {member.lastname}</span>}



      {purchases &&
        purchases.map((purchase) => (
          <div className="productdetails">
            <img className="imagedetails" src={purchase.image_url} />
            <h1>{purchase.name}</h1>
            <button
              className="returnproduct"
              onClick={() =>
                returnproduct(purchase.id, !purchase.unavailable)
              }
            >
              Return Yarn
            </button>
          </div>
        ))}
    </>
  );
}