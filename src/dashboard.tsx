import { useState } from "react";
import data from "./data.json";
import { HiPlusCircle, HiMinusCircle } from "react-icons/hi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./components/ui/button";

interface cartItem {
  id: string;
  image: {
    thumbnail: string;
    mobile: string;
    tablet: string;
    desktop: string;
  };
  name: string;
  category: string;
  price: number;
}

interface quantityitem extends cartItem {
  quantity: number;
}
const handleConfirm = () => {};

const Dashboard = () => {
  
  const [clicks, setClicks] = useState<{ [id: string]: number }>({});
  const [cart, setCart] = useState<quantityitem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  const total = cart.reduce((acc,val)=>acc+val.quantity*val.price,0)

  const handleAdd = (item: cartItem) => {
    setClicks((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartitem) => cartitem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartitem) =>
          cartitem.id === item.id
            ? { ...cartitem, quantity: cartitem.quantity + 1 }
            : cartitem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    setCartCount((prevCount) => prevCount + 1);
  };
  const handleSub = (item: cartItem) => {
    const currentCount = clicks[item.id] || 0;

    if (currentCount > 0) {
      setClicks((prev) => ({
        ...prev,
        [item.id]: prev[item.id] - 1,
      }));

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (cartitem) => cartitem.id === item.id
        );

        if (existingItem) {
          return prevCart.map((cartitem) =>
            cartitem.id === item.id
              ? { ...cartitem, quantity: cartitem.quantity - 1 }
              : cartitem
          );
        } else {
          return prevCart.filter((cartitem) => cartitem.id != item.id);
        }
      });
      setCartCount((prevCount) => prevCount - 1);
    }
  };
  const handleReset = (item: quantityitem) => {
    setCart((prev) => prev.filter((cartitem) => cartitem.id != item.id));
    setClicks((prev) => ({ ...prev, [item.id]: 0 }));
    setCartCount((prev) => prev - item.quantity);
  };
  return (
    <section className="bg-[var(--rose50)]  flex flex-col md:flex-row p-10">
     
      <div className="grid grid-cols-1  md:grid-cols-3 text-gray-900 gap-3 md:w-3/4">
        {data.map((item) => (
          <div key={item.id}>
            <div className={`  `}>
              <div
                className={`${
                  clicks[item.id] ? " " : ""
                } rounded  relative overflow-hidden`}
              >
                <img
                  src={item.image.mobile}
                  alt="image"
                  className={`rounded border ${
                    clicks[item.id] ? "border-3 border-[var(--red)]" : ""
                  }`}
                />
                <div
                  className={`bg-[var(--red)] -translate-y-4 w-40 translate-x-[50%] px-3 py-1 rounded-full items-center flex justify-between ${
                    clicks[item.id] ? "flex" : "hidden"
                  }`}
                >
                  <p
                    onClick={() => handleSub(item)}
                    className={`cursor-pointer`}
                  >
                    <HiMinusCircle className="hover:text-gray-100 transition-all" />
                  </p>
                  <p>{clicks[item.id]}</p>
                  <p
                    onClick={() => handleAdd(item)}
                    className={`cursor-pointer`}
                  >
                    <HiPlusCircle  className="hover:text-gray-100 transition-all"/>
                  </p>
                </div>
                <div
                  onClick={() => {
                    handleAdd(item);
                  }}
                  className={`${
                    !clicks[item.id]
                      ? "  hover:border-[var(--red)] transition-all w-40 items-center -translate-y-4 translate-x-[50%] cursor-pointer  px-3 py-1 rounded-full bg-white flex justify-center text-gray-900 border"
                      : "hidden"
                  }`}
                >
                  🛒 add to cart
                </div>
              </div>
              <p>{item.category}</p>
              <p>{item.name}</p>
              <p className="text-[var(--red)]">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
      {cartCount > 0 && (
        <div className="flex flex-col shadow-md md:w-1/4 h-full bg-[var(--rose-50)] p-5">
          <h4 className="text-[var(--red)] text-xl font-bold">
            Your Cart ({cartCount})
          </h4>
          <div className="space-y-2">
            {cart
              .filter((item) => item.quantity > 0)
              .map((item) => (
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-900">{item.name}</p>

                    <p>
                      <span className="text-[var(--red)]">
                        {item.quantity}x
                      </span>{" "}
                      <span className="text-gray-400">@{item.price}</span>{" "}
                      <span className="text-[var(--rose500)]">
                        ${item.price * item.quantity}
                      </span>
                    </p>
                  </div>
                  <div
                    className="text-gray-300  cursor-pointer"
                    onClick={() => handleReset(item)}
                  >
                    <img
                      src="/images/icon-remove-item.svg"
                      className=" border border-black m-1 p-[1px] rounded-full"
                      alt=""
                    />
                  </div>
                </div>
              ))}

            {cartCount > 0 && (
              <div>
                <div className="flex justify-between">
                  <p>Order Total</p>
                  <p className="font-bold ">${total}</p>
                </div>
                <div className="text-gray-900 bg-[var(--rose100)] w-full my-3 p-1 rounded text-center justify-center flex items-center">
                  <img
                    src="/images/icon-carbon-neutral.svg
                "
                    alt=""
                  />
                  This is a
                  <strong className="text-black mx-1"> carbon-neutral </strong>
                  delivery
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        handleConfirm();
                      }}
                      className="bg-[var(--red)] font-semibold w-full cursor-pointer hover:bg-red-800 transition-all rounded-full px-2 py-1"
                    >
                      Confirm Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <div>
                      <div>
                        <img src="/images/icon-order-confirmed.svg" alt="" />
                        <h1 className="font-bold text-2xl">Order Confirmed</h1>
                        <p>we hope you enjoy your food!</p>
                      </div>
                      <div>
                        <div className="bg-[var(--rose100)] p-3 flex flex-col gap-3 rounded my-2">
                          {cart
                            .filter((cartitiem) => cartitiem.quantity > 0)
                            .map((cartitem) => (
                              <div className="flex justify-between ">
                                <div className="flex gap-2">
                                  <img
                                    src={cartitem.image.thumbnail}
                                    alt="thumbnail"
                                    className="size-10 rounded"
                                  />{" "}
                                  <div className="">
                                    <p className="text-sm">{cartitem.name}</p>
                                    <p className="text-xs text-[var(--red)]">
                                      <span className="text-xs ">
                                        {cartitem.quantity}X
                                      </span>
                                      <span className="text-[var(--rose500)] mx-1">
                                        @{cartitem.price}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <p className="font-normal">
                                  ${cartitem.price * cartitem.quantity}
                                </p>
                              </div>
                            ))}
                          <div className="flex justify-between items-center">
                            <p>Order Total</p>
                            <p className="font-extrabold">${total}</p>
                          </div>
                        </div>

                        <DialogClose className="w-full  cursor-pointer">
                          <button className="bg-[var(--red)] p-2  text-white w-full rounded-full">
                            Start new Order
                          </button>
                        </DialogClose>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      )}
      {cartCount === 0 && (
        <div className="text-center justify-center p-10 mx-10">
          <p>your cart is empty </p>
          <img src="/images/illustration-empty-cart.svg" alt="" />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
