import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    type ChipProps,
    IconButton,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PublicIcon from "@mui/icons-material/Public";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {useEffect, useState} from "react";
import type {DishWithMeta, ToastData} from "../../RestaurantDashboardPage.tsx";
import {useDishStockStatus, usePublishDish} from "../../../../hooks/DishesHooks.tsx";


interface DishCardProps {
    dish: DishWithMeta;
    restaurantId: string
    onEdit: () => void;
    onPreview?: (id: string) => void;
    setToast: React.Dispatch<React.SetStateAction<ToastData>>;

}

interface Type {
    color: ChipProps["color"];
    label: string;
}

export default function DishCard({dish, restaurantId, onEdit, onPreview, setToast}: DishCardProps) {
    const [localPublished, setLocalPublished] = useState(!dish.isDraft || dish.hasLiveVersion);
    const [localStock, setLocalStock] = useState(dish.isInStock);
    const [hasPublishChanges, setHasPublishChanges] = useState(false)
    const [hasStockChanges, setHasStockChanges] = useState(false)


    const {
        isError: isErrorPublish, isPending: isPendingPublish, error: publishError, publishDishMutation
    } = usePublishDish();

    const {isError: isErrorStock, isPending: isPendingStock, error: stockError, dishStockStatusMutation}
        = useDishStockStatus();


    useEffect(() => {

            if (!hasPublishChanges) return

            if (!isPendingPublish && !isErrorPublish && publishError == null) {
                setToast({
                    open: true,
                    severity: "success",
                    message: " Dish is " + (localPublished ? "published" : "unpublished")
                });
                setHasPublishChanges(false)
            }
            if (isErrorPublish) {
                setToast({
                    open: true,
                    severity: "error",
                    message: publishError?.message ?? "Unknown error during " + (localPublished ? "publish" : "unpublish")
                });
                setHasStockChanges(false)

            }
        },
        [isPendingPublish, isErrorPublish, setToast, publishError, localPublished, hasPublishChanges, setHasPublishChanges]);

    useEffect(() => {

            if (!hasStockChanges) return

            if (!isPendingStock && !isErrorStock && stockError == null) {
                setToast({
                    open: true,
                    severity: "success",
                    message: " Dish now " + (localStock ? "' IN STOCK '" : "' OUT OF STOCK '")
                });
                setHasStockChanges(false)
            }
            if (isErrorStock) {
                setToast({
                    open: true,
                    severity: "error",
                    message: stockError?.message ?? "Unknown error during set to " + (localStock ? "IN STOCK" : "OUT OF STOCK")
                });
                setHasStockChanges(false)

            }
        },
        [isErrorStock, isPendingStock, setToast, stockError, localStock, setHasStockChanges, hasStockChanges]);


    const onToggle = (dishId: string, field: "published" | "inStock", status: boolean) => {

        if (field === 'published') {
            publishDishMutation({restaurantId: restaurantId, dishId: dishId, isPublished: status});
            setHasPublishChanges(true)
        } else {
            dishStockStatusMutation({restaurantId: restaurantId, dishId: dishId, isStock: status});
            setHasStockChanges(true)
        }

    }

    const handleToggle = (field: "published" | "inStock") => {
        if (field === "published") {
            const next = !localPublished;
            setLocalPublished(next);
            onToggle(dish.id, "published", next);
        } else {
            const next = !localStock;
            setLocalStock(next);
            onToggle(dish.id, "inStock", next);
        }
    };

    const getDishType = (): Type => {
        if (dish.isDraft && dish.hasLiveVersion) return {label: "DRAFT (based on LIVE)", color: "info"};
        if (dish.isDraft) return {label: "DRAFT", color: "warning"};
        return {label: "LIVE", color: "success"};
    };

    const type = getDishType();

    return (
        <Card sx={{
            height: "100%",
            width: 350,
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            position: "relative"
        }}
        >

            <Chip
                label={type.label}
                color={type.color}
                size="small"
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    fontWeight: 600,
                    zIndex: 2
                }}
            />

            <CardActionArea disableRipple>
                <CardMedia
                    component="img"
                    image={dish.pictureUrl}
                    alt={dish.name}
                    sx={{height: 140, objectFit: "cover"}}
                />
                <CardContent sx={{flexGrow: 1}}>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={700}>{dish.name}</Typography>
                        <Typography variant="body2" color="text.secondary"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden"
                                    }}>
                            {dish.description}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{p: 1.5, pt: 0}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title={dish.isDraft ? "Edit this draft" : "Create a draft to edit"}>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditOutlinedIcon/>}
                            onClick={onEdit}
                        >
                            Edit
                        </Button>
                    </Tooltip>

                    {(!dish.isDraft || dish.hasLiveVersion) && (
                        <Tooltip title="View live version">
                            <IconButton size="small" onClick={() => onPreview?.(dish.id)}>
                                <VisibilityOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>

                <ToggleButtonGroup size="small" exclusive={false}>
                    <Tooltip title={localPublished ? "Unpublish this dish" : "Publish this dish"}>
                        <ToggleButton
                            value="publish"
                            selected={localPublished}
                            onChange={() => handleToggle("published")}
                            sx={{
                                "&.Mui-selected": {bgcolor: "success.main", color: "white"},
                                fontSize: "0.6rem"
                            }}
                        >
                            <PublicIcon fontSize="small" sx={{mr: 0.5}}/> {localPublished ? 'UnPublish' : 'Publish'}
                        </ToggleButton>
                    </Tooltip>

                    <Tooltip title={localStock ? "Mark Out of Stock" : "Mark in Stock"}>
                        <ToggleButton
                            value="stock"
                            selected={localStock}
                            onChange={() => handleToggle("inStock")}
                            sx={{
                                "&.Mui-selected": {bgcolor: "primary.main", color: "white"},
                                fontSize: "0.6rem"
                            }}
                        >
                            <StorefrontIcon fontSize="small"
                                            sx={{mr: 0.5}}/>{localStock ? 'Set Out Stock' : 'Set In stock'}
                        </ToggleButton>
                    </Tooltip>
                </ToggleButtonGroup>
            </Stack>
        </Card>
    );
}
