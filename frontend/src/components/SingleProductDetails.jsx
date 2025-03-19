import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMoreDetails } from "../api";
import { handlePurchase } from "../api";

export default function SingleProductDetails() {
    const { id } = useParams();
    const [productDetails, setProductDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getSingleProduct(id) {
            setProductDetails(await getMoreDetails(id));
        }
        getSingleProduct(id);
    }, []);

    const purchase = async (productId, available) => {
        const token = localStorage.getItem("token")
        const purchaseResponse = await handlePurchase(productId, available, token)
    }
    return (
        <>
            <div className="masterdetail">
                {
                    productDetails && (<div className="productdetails">
                        <img className="imagedetails" src={productDetails.image_url} />
                        <h1>{productDetails.name}</h1>
                        <h2 className="availability">Status Availability: {productDetails.available ? "available" : "unavailable"}</h2>

                        {
                            productDetails && (<button className="purchase" onClick={() => purchase(productDetails.id, !productDetails.available)}>Purchase

                            </button>)
                        }

                        <button
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            Back
                        </button>


                    </div>)
                }
            </div>


        </>
    );

}





