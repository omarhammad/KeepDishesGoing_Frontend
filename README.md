# Keep Dishes Going – Frontend

## Technologies Used

- Reactjs
- Typescript
- Hooks like (useQuery, useForm, useMutation, useStates, useParams and useEffect)
- Routing
- AuthGuard for pages requires authentication
- MUI
- Skeleton for fallback pages
- custom hooks

## Challenges & Accomplishments

### In this project, I've faced many challenges:

1) Dealing with hooks carefully, as it can affect the performance of the application.
2) Figuring out how to distinguish between pages that require authentication and those that don’t is what led me to
   create the AuthGuard component. to create the AuthGuard component.
3) Splitting a page into components is a bit challenging and requires full analysis before implementation.

But despite all these challenges, it was a great opportunity to improve my frontend development skills, and now I feel
more confident building responsive and scalable apps.

Finally, I'm proud of my project structure, as it's easy to track everything from how components are organized to how
data flows between pages, hooks, and services, making debugging and future updates much simpler.



---

## ✅ Finished Features

- [x] Sign-In/Sign-Up pages for the restaurant owner
- [X] In the case of a new owner , a restaurant add form shown for the owner , but if he has it will be redirected to
  the Restaurant Dashboard
- [x] Restaurant Dashboard page where the owner can manage all dishes and orders
- [x] Owner can see three statuses on a dish [Live, Draft, Draft(based on live)]
- [x] Owner can add a new draft dish and edit a dish.
- [x] Owner can preview a dish that has a live version to see what info customers see
- [x] Owner can publish/unpublish and set inStock/outStock dishes each or All in one action also with a scheduled time.
- [x] Owner can reject(+reason)/accept an order and mark it as ready for pickup in case if it's accepted
- [x] Owner can see the order status changes
- [x] Owner can open/close the restaurant manually and set it to AUTO for the status to be given based on the opening
  hours
- [x] Customers can explore all restaurants from the Landing page
- [x] Customers can from the restaurant page see all dishes that are published
- [x] Customers can filter dishes based on [FOOD_TAG, DISH_TYPE] also sort it based on [PRICE, NAME]
- [x] Customers can add to the basket dishes that are PUBLISHED and IN_STOCK
- [x] When customer clicks continue from the basket, it'll be blocked in case these dishes are unpublished/out-stock ,
  from different restaurants or restaurant is closed.
- [x] If the customer is allowed to continue with the dishes in the basket, it will be redirected to the checkout page
- [x] Checkout page, where the customer can provide his information and delivery address, also the payment info and
  then (confirm and pay)
- [x] If the checkout is processed successfully, a dialog with an order tracking link is shown.
- [x] In the order tracking page, the customer sees live order status changes from PLACED to DELIVERED if all went good
  but if DECLINED/REJECTED customer will see a reason message

---

## ❌ Unfinished Features

List features that are not yet implemented.

- [x] Restaurant filtering feature
- [x] Owners can’t change the opening hours.
- [x] A view to see the price evolution of a restaurant
- [x] Customers can see all published dishes and not only 10
- [x] Customers can't see the estimated delivery time.

