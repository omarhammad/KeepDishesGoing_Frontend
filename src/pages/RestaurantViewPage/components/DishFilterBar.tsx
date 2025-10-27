import {Box, Chip, FormControl, InputLabel, MenuItem, Select, Stack,} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import type {DishFilter} from "../RestaurantViewPage.tsx";

interface DishFilterBarProps {
    dishTypes: string[];
    foodTags: string[];
    onFilterChange: React.Dispatch<React.SetStateAction<DishFilter>>;
}

function DishFilterBar({dishTypes, foodTags, onFilterChange}: DishFilterBarProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sort, setSort] = useState<string>("default");

    const handleTypeChange = (type: string) => {
        const newType = selectedType === type ? null : type;
        setSelectedType(newType);
        onFilterChange({type: newType, tags: selectedTags, sort});
    };

    const handleTagToggle = (tag: string) => {
        const updated =
            selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag];
        setSelectedTags(updated);
        onFilterChange({type: selectedType, tags: updated, sort});
    };

    const handleSortChange = (e: any) => {
        setSort(e.target.value);
        onFilterChange({type: selectedType, tags: selectedTags, sort: e.target.value});
    };

    return (
        <Box
            sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                px: 3,
                py: 2,
                mb: 4,
                display: "flex",
                flexDirection: {xs: "column", md: "row"},
                alignItems: {xs: "flex-start", md: "center"},
                justifyContent: "space-between",
                gap: 2,
            }}
        >
            {/* Filters */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
                {dishTypes.map((type) => (
                    <Chip
                        key={type}
                        label={type}
                        onClick={() => handleTypeChange(type)}
                        color={selectedType === type ? "primary" : "default"}
                        variant={selectedType === type ? "filled" : "outlined"}
                        sx={{
                            color: selectedType === type ? "white" : "inherit",
                            fontWeight: 600,
                        }}
                    />
                ))}

                {foodTags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleTagToggle(tag)}
                        color={selectedTags.includes(tag) ? "success" : "default"}
                        variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                        sx={{
                            color: selectedTags.includes(tag) ? "white" : "inherit",
                            fontWeight: 500,
                        }}
                    />
                ))}
            </Stack>

            {/* Sorting */}
            <FormControl size="small" sx={{minWidth: 160}}>
                <InputLabel sx={{color: "white"}}>Sort by</InputLabel>
                <Select
                    value={sort}
                    onChange={handleSortChange}
                    sx={{
                        color: "white",
                        borderColor: "rgba(255,255,255,0.4)",
                        ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,255,255,0.4)",
                        },
                        "& .MuiSvgIcon-root": {color: "white"},
                    }}
                >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="price-asc">Price: Low → High</MenuItem>
                    <MenuItem value="price-desc">Price: High → Low</MenuItem>
                    <MenuItem value="name-asc">Name: A → Z</MenuItem>
                    <MenuItem value="name-desc">Name: Z → A</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default DishFilterBar;