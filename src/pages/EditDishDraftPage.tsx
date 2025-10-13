import EditDishForm from "../components/EditDishForm/EditDishForm.tsx";
import EditDishFallBack from "../components/EditDishForm/EditDishFallBack.tsx";
import {useDish, useUpdateDish} from "../hooks/DishesHooks.tsx";
import {useNavigate, useParams} from "react-router";
import type {editDishInterface} from "../model/schemas/editDishInterface.tsx";
import type {Dish} from "../model/Dish.tsx";

function EditDishDraftPage() {

    const navigate = useNavigate();
    const {restaurantId, dishId} = useParams();
    const {updateDishMutation, isError, isPending, error} = useUpdateDish()

    const {
        isError: isErrorDraft,
        isLoading: isLoadingDraft,
        dish: draft,
        refetch: refetchDraft

    } = useDish(restaurantId!, dishId!, 'draft', true)

    const {
        isError: isErrorLive,
        isLoading: isLoadingLive,
        dish: live,
        refetch: refetchLive
    } = useDish(restaurantId!, dishId!, 'live', (!isLoadingDraft && !draft));


    const currentData = draft === undefined ? live : draft;

    const handleOnRetry = () => {
        refetchLive();
        refetchDraft()
    }

    const handleOnSubmit = (data: editDishInterface) => {
        const request: Dish = {
            id: dishId!,
            name: data.name,
            dishType: data.dishType,
            foodTags: data.foodTags,
            description: data.description,
            price: parseFloat(data.price),
            pictureUrl: data.pictureUrl
        }

        updateDishMutation({restaurantId: restaurantId!, dishId: dishId!, request: request});
        navigate('/owner/dashboard')

    };


    return (
        <div>
            <EditDishFallBack isLoading={isLoadingLive || isLoadingDraft} isError={isErrorDraft && isErrorLive}
                              onRetry={handleOnRetry}>
                <EditDishForm currentData={currentData} onSubmit={handleOnSubmit} isError={isError}
                              isPending={isPending}
                              error={error!}/>
            </EditDishFallBack>
        </div>
    );
}

export default EditDishDraftPage;