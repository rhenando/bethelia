"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CategoriesCarousel = ({ categories }) => {
  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-10'>
          <h2 className='text-3xl font-bold'>Popular Categories</h2>
          <Button variant='outline' className='text-blue-600'>
            View All Categories <i className='fas fa-arrow-right ml-2'></i>
          </Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {categories.map((cat) => (
            <Card key={cat.id}>
              <img
                src={cat.image}
                alt={cat.name}
                className='w-full h-48 object-cover'
              />
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold'>{cat.name}</h3>
                <p className='text-gray-600 mb-3'>{cat.description}</p>
                <div className='flex justify-between items-center'>
                  <span className='text-blue-600'>
                    {cat.count.toLocaleString()} Products
                  </span>
                  <i className='fas fa-arrow-right text-blue-600'></i>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesCarousel;
