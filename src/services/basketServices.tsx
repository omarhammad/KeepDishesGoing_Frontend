import type {BasketItem} from "../model/BasketItem.tsx";


function getBasket() {
    const basketString: string | null = localStorage.getItem("basket");

    if (basketString) {
        const basket: BasketItem[] = JSON.parse(basketString);
        return basket;
    }
    return []

}

export function saveItemToBasket(basketItem: BasketItem) {

    const basket: BasketItem[] = getBasket()
    let updated: boolean = false;

    for (const bi of basket) {
        if (bi.dishId === basketItem.dishId) {
            bi.quantity += basketItem.quantity
            updated = true;
            break;
        }
    }
    if (!updated) basket.push(basketItem)
    localStorage.setItem("basket", JSON.stringify(basket));
    window.dispatchEvent(new Event("basketUpdated"));
}

export function getBasketItems() {
    return getBasket();
}

export function deleteBasketItem(dishId: string) {
    const basket: BasketItem[] = getBasket()
    const updatedBasket = basket.filter(item => item.dishId !== dishId);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
    window.dispatchEvent(new Event("basketUpdated"));

}


export function clearBasket() {
    localStorage.removeItem("basket")
    window.dispatchEvent(new Event("basketUpdated"));
}