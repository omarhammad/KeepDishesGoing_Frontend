import {Badge, Box, Button, Chip, FormControl, MenuItem, Select, Stack, Tooltip, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {usePublishAllPendingDishes, useSchedulePublishForAllPendingDishes} from "../../../../hooks/DishesHooks.tsx";
import type {ToastData} from "../../RestaurantDashboardPage.tsx";
import PublishDialog from "../PublishDialog/PublishDialog.tsx";
import {updateRestaurantStatus} from "../../../../services/restaurantService.tsx";

interface DashboardHeaderProps {
    name: string;
    imageUrl: string;
    totalDishes: number;
    restaurantId: string
    currentOpenStatus: string
    nextScheduledTime: string | null
    setToast: React.Dispatch<React.SetStateAction<ToastData>>;
}

export default function DashboardHeader({
                                            name,
                                            imageUrl,
                                            restaurantId,
                                            currentOpenStatus,
                                            totalDishes,
                                            nextScheduledTime,
                                            setToast
                                        }: DashboardHeaderProps) {


    const [publishOpen, setPublishOpen] = useState(false);
    const [hasPublished, setHasPublished] = useState(false);
    const [scheduledAt, setScheduledAt] = useState<string>("");


    const [openStatus, setOpenStatus] = useState<string>(currentOpenStatus.toUpperCase());


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

    const handleStatusChange = async (status: string) => {
        setOpenStatus(status);
        await updateRestaurantStatus(restaurantId, status)
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
            {/* Background image */}
            <Box
                component="img"
                src={imageUrl}
                alt={name}
                sx={{
                    width: "100%",
                    height: {xs: 180, sm: 240, md: 300},
                    objectFit: "cover",
                    filter: "brightness(65%)",
                }}
            />

            {/* Overlay */}
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
                {/* Info Section */}
                <Box
                    sx={{
                        bgcolor: "rgba(0,0,0,0.6)",
                        px: 2,
                        py: 1.5,
                        borderRadius: 1,
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
                            }}
                        >
                            Next scheduled publish: {nextScheduledTime}
                        </Typography>
                    )}

                    {/* Open Status */}
                    <Stack direction="row" alignItems="center" spacing={2} mt={1.5}>
                        <Chip
                            label={
                                openStatus === "OPEN"
                                    ? "Open now"
                                    : openStatus === "CLOSE"
                                        ? "Closed now"
                                        : "Auto mode"
                            }
                            color={
                                openStatus === "OPEN"
                                    ? "success"
                                    : openStatus === "CLOSE"
                                        ? "error"
                                        : "info"
                            }
                            sx={{fontWeight: 600}}
                        />

                        <FormControl
                            size="small"
                            sx={{
                                bgcolor: "white",
                                borderRadius: 1,
                                minWidth: 120,
                            }}
                        >
                            <Select
                                value={openStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                <MenuItem value="OPEN">Open</MenuItem>
                                <MenuItem value="CLOSE">Closed</MenuItem>
                                <MenuItem value="AUTO">Auto</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Box>

                {/* Publish Button */}
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
                sx={{
                    bgcolor: "primary.main",
                    fontWeight: 600,
                    "&:hover": {bgcolor: "primary.dark"},
                    "&.Mui-disabled": {
                        bgcolor: "primary.light",
                        color: "white",
                        opacity: 0.7,
                    },
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
