"use client";

import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "@/store/searchSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";

export default function SearchBar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.searchQuery);

  return (
    <div className='relative flex items-center w-[600px]'>
      <Button variant='outline' className='rounded-l-md cursor-pointer gap-1'>
        All Categories
        <ChevronDown className='w-4 h-4' />
      </Button>
      <Input
        className='flex-1 border-x-0 focus:ring-0'
        placeholder='Search products, suppliers, and more…'
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />
      <Button className='bg-blue-600 text-white rounded-r-md cursor-pointer gap-2'>
        <Search className='w-4 h-4' />
        Search
      </Button>
    </div>
  );
}
