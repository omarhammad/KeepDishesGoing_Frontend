import {useParams} from "react-router";
import {useDish} from "../../hooks/DishesHooks.tsx";
import DishViewFallback from "./components/DishViewFallback.tsx";
import DishView from "./components/DishView.tsx";

function DishViewPage() {

    const {restaurantId, dishId} = useParams();

    const {dish, isError, isLoading, refetch} = useDish(restaurantId!, dishId!, "live", true);

    const handleOnRetry = () => {
        refetch();

    };

    return (
        <DishViewFallback isLoading={isLoading} isError={isError} onRetry={handleOnRetry}>
            {dish && <DishView dish={dish}/>}
        </DishViewFallback>
    );
}

export default DishViewPage;
