export function flyToCartAnimation(productId: number) {
  // Delay a tiny bit to ensure DOM stability
  setTimeout(() => {
    const productImg = document.querySelector(
      `[data-product-id="${productId}"]`
    ) as HTMLElement | null;
    const cartIcon = document.querySelector("#cart-icon") as HTMLElement | null;
    if (!productImg || !cartIcon) return;

    const imgClone = productImg.cloneNode(true) as HTMLElement;
    const imgRect = productImg.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    Object.assign(imgClone.style, {
      position: "fixed",
      top: `${imgRect.top}px`,
      left: `${imgRect.left}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
      borderRadius: "8px",
      zIndex: "9999",
      pointerEvents: "none",
      transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s",
      willChange: "transform, opacity",
    });

    document.body.appendChild(imgClone);
    imgClone.getBoundingClientRect(); // force reflow

    const translateX =
      cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const translateY =
      cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);

    imgClone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.1)`;
    imgClone.style.opacity = "0.2";

    // bounce + cleanup
    setTimeout(() => {
      bounceCart();
      imgClone.remove();
    }, 850);
  }, 50); // slight delay ensures stability
}

function bounceCart() {
  const cart = document.querySelector("#cart-icon");
  if (!cart) return;
  cart.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.3)" },
      { transform: "scale(1)" },
    ],
    { duration: 400, easing: "ease" }
  );
}
