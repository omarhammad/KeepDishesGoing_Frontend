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
import {useState} from "react";
import type {DishWithMeta} from "../../pages/RestaurantDashboardPage.tsx";


interface DishCardProps {
    dish: DishWithMeta;
    onEdit: (id: string) => void;
    onToggle: (id: string, field: "published" | "inStock", value: boolean) => void;
    onPreview?: (id: string) => void;
}

interface Status {
    color: ChipProps["color"];
    label: string;
}

export default function DishCard({dish, onEdit, onToggle, onPreview}: DishCardProps) {
    const [localPublished, setLocalPublished] = useState(!dish.isDraft || dish.hasLiveVersion);
    const [localStock, setLocalStock] = useState(dish.isInStock ?? true);

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

    const getDishStatus = (): Status => {
        if (dish.isDraft && dish.hasLiveVersion) return {label: "DRAFT (based on LIVE)", color: "info"};
        if (dish.isDraft) return {label: "DRAFT", color: "warning"};
        return {label: "LIVE", color: "success"};
    };

    const status = getDishStatus();

    return (
        <Card sx={{
            height: "100%",
            width: 350,
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            position: "relative"
        }}>
            {/* Status chip */}
            <Chip
                label={status.label}
                color={status.color}
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
                            onClick={() => onEdit(dish.id)}
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
                                fontSize: "0.75rem"
                            }}
                        >
                            <PublicIcon fontSize="small" sx={{mr: 0.5}}/> Publish
                        </ToggleButton>
                    </Tooltip>

                    <Tooltip title={localStock ? "Mark Out of Stock" : "Mark in Stock"}>
                        <ToggleButton
                            value="stock"
                            selected={localStock}
                            onChange={() => handleToggle("inStock")}
                            sx={{
                                "&.Mui-selected": {bgcolor: "primary.main", color: "white"},
                                fontSize: "0.75rem"
                            }}
                        >
                            <StorefrontIcon fontSize="small" sx={{mr: 0.5}}/> In stock
                        </ToggleButton>
                    </Tooltip>
                </ToggleButtonGroup>
            </Stack>
        </Card>
    );
}
