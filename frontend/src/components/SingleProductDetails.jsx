import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMoreDetails } from "../api";
import { handlePurchase } from "../api";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import QuantityButton from "./QuantityButton";

export default function SingleProductDetails() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getSingleProduct() {
      const response = await getMoreDetails(id);
      setProductDetails(response.allProducts);
    }
    getSingleProduct(id);
  }, []);

  const purchase = async (productId, available) => {
    const token = localStorage.getItem("token");
    const purchaseResponse = await handlePurchase(productId, available, token);
    console.log(purchaseResponse);
  };
  console.log(productDetails);
  return (
    <>
      <ReviewsList />
      {showReviewForm && <ReviewForm />}
      <div className="masterdetail">
        {productDetails && (
          <div className="productdetails">
            <img className="imagedetails" src={productDetails.image_url} />
            <h1>{productDetails.name}</h1>
            <h2 className="availability">
              status availability:{" "}
              {productDetails.available ? "available" : "unavailable"}
            </h2>

            {productDetails && (
              <button
                className="purchase"
                onClick={() =>
                  purchase(productDetails.id, !productDetails.available)
                }
              >
                add to cart
              </button>
            )}

            <button
              onClick={() => {
                navigate("/");
              }}
            >
              back
            </button>

            <button
              onClick={() => {
                setShowReviewForm(!showReviewForm);
              }}
            >
              leave a review
            </button>
            <QuantityButton />
          </div>
        )}
      </div>
    </>
  );
}
