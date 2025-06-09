"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const VerifiedSuppliers = ({ suppliers }) => {
  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-10'>
          <h2 className='text-3xl font-bold'>Verified Suppliers</h2>
          <Button variant='outline' className='text-blue-600'>
            View All Suppliers <i className='fas fa-arrow-right ml-2'></i>
          </Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {suppliers.map((sup) => (
            <Card key={sup.id}>
              <CardContent>
                <div className='flex items-center gap-4'>
                  <Avatar className='h-16 w-16'>
                    <AvatarImage src={sup.logo} alt={sup.name} />
                    <AvatarFallback>{sup.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='text-lg font-semibold'>{sup.name}</h3>
                    <Badge className='bg-blue-600 mr-2'>
                      <i className='fas fa-check-circle mr-1' /> Verified
                    </Badge>
                    <span className='text-sm text-gray-600'>
                      <i className='fas fa-clock mr-1' /> {sup.responseRate}%
                    </span>
                  </div>
                </div>
                <div className='mt-4 text-gray-700'>
                  <strong>Main Products:</strong> {sup.mainProducts}
                </div>
                <div className='mt-6 flex gap-4'>
                  <Button variant='outline'>View Profile</Button>
                  <Button className='bg-blue-600 text-white'>Contact</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VerifiedSuppliers;
