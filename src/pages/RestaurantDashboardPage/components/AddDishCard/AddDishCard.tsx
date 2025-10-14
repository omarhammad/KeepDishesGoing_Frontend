import {Card, CardActionArea, Stack, Typography} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface AddDishCardProps {
    onAdd: () => void;
}

export default function AddDishCard({onAdd}: AddDishCardProps) {
    return (
        <Card sx={{height: "100%", width: 350, border: "1px dashed", borderColor: "divider"}}>
            <CardActionArea
                onClick={onAdd}
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                }}
            >
                <Stack spacing={1} alignItems="center">
                    <AddCircleOutlineIcon fontSize="large"/>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Add new dish
                    </Typography>
                </Stack>
            </CardActionArea>
        </Card>
    );
}
