"use client";

import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "@/store/searchSlice";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.searchQuery);

  return (
    <div className='relative w-full'>
      <Input
        className='w-full border border-primary focus:border-primary focus:ring-primary rounded-md pl-10'
        placeholder='Search products, suppliers, and more…'
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary' />
    </div>
  );
}
