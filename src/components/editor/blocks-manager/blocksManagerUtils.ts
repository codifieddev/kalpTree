// Utility functions for blocks manager

import { BlocksModel } from "@/types/block/Blocks";



// Helper function to group blocks by category
export const groupBlocksByCategory = (blocks: BlocksModel[]) => {
  return blocks.reduce((acc, block) => {
    const category = block.category || "Basic";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(block);
    return acc;
  }, {});
};

// Helper function to get unique categories
export const getCategories = (blocksByCategory: Record<string, any[]>) => {
  return [
    "all",
    "favorites",
    "recent",
    ...Object.keys(blocksByCategory).sort(),
  ];
};

// Helper function to filter blocks
export const filterBlocks = (
  blocks: any[],
  searchTerm: string,
  activeCategory: string,
  favoritesList: string[],
  recentBlocksList: string[]
) => {
  return blocks.filter((block) => {
    const matchesSearch =
      block.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (block.category &&
        block.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (block.description &&
        block.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeCategory === "all") {
      return matchesSearch;
    } else if (activeCategory === "favorites") {
      return matchesSearch && favoritesList.includes(block.id);
    } else if (activeCategory === "recent") {
      return matchesSearch && recentBlocksList.includes(block.id);
    } else {
      return matchesSearch && block.category === activeCategory;
    }
  });
};
