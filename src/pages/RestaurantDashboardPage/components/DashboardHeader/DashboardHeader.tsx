import {Badge, Box, Button, Stack, Tooltip, Typography} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import * as React from "react";
import {useEffect, useState} from "react";
import {usePublishAllPendingDishes, useSchedulePublishForAllPendingDishes} from "../../../../hooks/DishesHooks.tsx";
import type {ToastData} from "../../RestaurantDashboardPage.tsx";
import PublishDialog from "../PublishDialog/PublishDialog.tsx";

interface DashboardHeaderProps {
    name: string;
    imageUrl: string;
    totalDishes: number;
    restaurantId: string
    nextScheduledTime: string | null
    setToast: React.Dispatch<React.SetStateAction<ToastData>>;
}

export default function DashboardHeader({
                                            name,
                                            imageUrl,
                                            restaurantId,
                                            totalDishes,
                                            nextScheduledTime,
                                            setToast
                                        }: DashboardHeaderProps) {


    const [publishOpen, setPublishOpen] = useState(false);
    const [hasPublished, setHasPublished] = useState(false);
    const [scheduledAt, setScheduledAt] = useState<string>("");

    const {
        isError: isErrorPublishAll,
        isPending: isPendingPublishAll,
        error: publishAllError,
        publishAllPendingDishesMutation
    } = usePublishAllPendingDishes();

    const {
        isError: isErrorSchedulePublsih,
        isPending: isPendingSchedulePublsih,
        error: schedulePublsihError,
        schedulePublishForAllPendingDishesMutation
    } = useSchedulePublishForAllPendingDishes();

    // Publish all useEffect
    useEffect(() => {
            if (!hasPublished) return
            if (!isPendingPublishAll && !isErrorPublishAll && publishAllError == null) {
                setToast({
                    open: true,
                    severity: "success",
                    message: "All dishes published now."
                });
                setHasPublished(false)
            }
            if (isErrorPublishAll) {
                setToast({
                    open: true,
                    severity: "error",
                    message: publishAllError?.message ?? "Unknown error when publish all pending dishes"
                });
                setHasPublished(false)
            }
        },
        [isPendingPublishAll, isErrorPublishAll, publishAllError, setToast, hasPublished, setHasPublished]);

    // SchedulePublish useEffect
    useEffect(() => {
            if (!scheduledAt) return
            if (!isPendingSchedulePublsih && !isErrorSchedulePublsih && schedulePublsihError == null) {
                setToast({
                    open: true,
                    severity: "success",
                    message: `All dishes scheduled for ${scheduledAt}.`
                });
                setScheduledAt("")
            }
            if (isErrorSchedulePublsih) {
                setToast({
                    open: true,
                    severity: "error",
                    message: schedulePublsihError?.message ?? "Unknown error when schedule publish for all pending dishes"
                });
                setScheduledAt("")
            }
        },
        [isPendingSchedulePublsih, isErrorSchedulePublsih, schedulePublsihError, setToast, scheduledAt, setScheduledAt]);

    const onPublishAll = () => setPublishOpen(true);

    const handleConfirmPublish = (mode: "now" | "schedule", time?: string) => {
        setPublishOpen(false);
        if (mode === "now") {
            publishAllPendingDishesMutation({restaurantId: restaurantId})
            setHasPublished(true)
        } else {

            console.log(time)
            schedulePublishForAllPendingDishesMutation({restaurantId: restaurantId, scheduleTime: time!})
            setScheduledAt(new Date(time!).toLocaleString())
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                mb: 3,
                textAlign: "left",
            }}
        >
            <Box
                component="img"
                src={imageUrl}
                alt={name}
                sx={{
                    width: "100%",
                    height: {xs: 180, sm: 240, md: 300},
                    objectFit: "cover",
                    filter: "brightness(65%)",
                    display: "block",
                }}
            />

            <Stack
                direction={{xs: "column", sm: "row"}}
                spacing={2}
                sx={{
                    position: "absolute",
                    left: 24,
                    bottom: 24,
                    right: 24,
                    alignItems: {xs: "flex-start", sm: "center"},
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        bgcolor: "rgba(0,0,0,0.6)",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.4)",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                        }}
                    >
                        {name}
                    </Typography>

                    {nextScheduledTime && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(255,255,255,0.9)",
                                mt: 0.5,
                                fontStyle: "italic",
                                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                            }}
                        >
                            Next scheduled publish: {nextScheduledTime}
                        </Typography>
                    )}
                </Box>

                <Badge
                    color="error"
                    badgeContent={totalDishes}
                    overlap="rectangular"
                    anchorOrigin={{vertical: "top", horizontal: "right"}}
                    sx={{
                        "& .MuiBadge-badge": {
                            fontSize: "0.8rem",
                            height: 30,
                            minWidth: 30,
                            borderRadius: "50%",
                            fontWeight: 600,
                        },
                    }}
                >
                    <Tooltip
                        title={totalDishes === 0 ? "No dishes to publish" : ""}
                        disableHoverListener={totalDishes !== 0}
                    >
          <span>
            <Button
                onClick={onPublishAll}
                variant="contained"
                disabled={totalDishes === 0}
                startIcon={<PublishIcon/>}
                sx={{
                    bgcolor: "primary.main",
                    fontWeight: 600,
                    "&:hover": {bgcolor: "primary.dark"},
                    "&.Mui-disabled": {
                        bgcolor: "primary.light",
                        color: "white",
                        opacity: 0.7,
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                    },
                    boxShadow: "0px 3px 6px rgba(0,0,0,0.3)",
                }}
            >
              Publish All
            </Button>
          </span>
                    </Tooltip>
                </Badge>
            </Stack>

            <PublishDialog
                open={publishOpen}
                onClose={() => setPublishOpen(false)}
                onConfirm={handleConfirmPublish}
            />
        </Box>
    );
}
