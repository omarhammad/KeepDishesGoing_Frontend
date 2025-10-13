import {Skeleton, Stack} from "@mui/material";

export function FormSkeleton() {
    return (
        <Stack spacing={3}>
            <Skeleton variant="text" width="60%" height={30}/>
            <Skeleton variant="rectangular" width="100%" height={50}/>
            <Skeleton variant="rectangular" width="100%" height={50}/>
            <Skeleton variant="rectangular" width="100%" height={100}/>
            <Skeleton variant="rectangular" width="40%" height={45} sx={{alignSelf: "center"}}/>
        </Stack>
    );
}