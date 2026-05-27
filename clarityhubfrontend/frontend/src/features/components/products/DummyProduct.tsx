import { useNavigate } from "react-router-dom";
import { ProductData } from "../../lib/data";

const DummyProduct = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ProductData.map((product, index) => {
          return (
            <div key={index} className=" shadow-xl ">
              <div className="bg-gray-400 rounded-t-lg ">
                <img
                  src={product.imageUrl}
                  alt=""
                  className="rounded-t-lg bg-contain  w-full mx-auto h-96"
                />
              </div>

              <div className="px-4 py-4 rounded-b-lg bg-gray-200/50">
                <p className="text-base  text-black w-[85%]">
                  {product.desc.split(" ").slice(0, 5).join(" ") + "..."}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-base text-black font-semibold">
                    {" "}
                    ${product.amount}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="rounded-2xl cursor-pointer px-3 py-1 text-sm text-white/80 font-semibold bg-gray-800"
                  >
                    Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DummyProduct;
