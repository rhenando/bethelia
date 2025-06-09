"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeaturedProducts = ({ featuredProducts }) => {
  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-10'>
          <h2 className='text-3xl font-bold'>Featured Products</h2>
          <Button variant='outline' className='text-blue-600'>
            View All Products <i className='fas fa-arrow-right ml-2'></i>
          </Button>
        </div>
        <Tabs defaultValue='all' className='mb-10'>
          <TabsList>
            <TabsTrigger value='all'>All Products</TabsTrigger>
            <TabsTrigger value='electronics'>Electronics</TabsTrigger>
            <TabsTrigger value='machinery'>Machinery</TabsTrigger>
            <TabsTrigger value='apparel'>Apparel</TabsTrigger>
            <TabsTrigger value='home'>Home & Garden</TabsTrigger>
          </TabsList>

          <TabsContent
            value='all'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
          >
            {featuredProducts.map((prod) => (
              <Card key={prod.id}>
                <img
                  src={prod.image}
                  alt={prod.name}
                  className='w-full h-64 object-contain p-4'
                />
                <CardContent className='p-6'>
                  <h3 className='text-lg font-semibold'>{prod.name}</h3>
                  <p className='text-gray-600 text-sm'>{prod.description}</p>
                  <p className='text-blue-600 font-semibold'>{prod.price}</p>
                  <div className='flex justify-between text-sm text-gray-500 mt-2'>
                    <span>Min. Order: {prod.minOrder}</span>
                    <div className='flex items-center'>
                      <i className='fas fa-star text-yellow-400 mr-1' />
                      <span>{prod.rating}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full bg-blue-600 text-white'>
                    <i className='fas fa-envelope mr-2' /> Contact Supplier
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value='electronics'>
            {/* Add electronics tab logic here */}
          </TabsContent>
          <TabsContent value='machinery'>
            {/* Add machinery tab logic here */}
          </TabsContent>
          {/* Add more tab content as needed */}
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedProducts;
