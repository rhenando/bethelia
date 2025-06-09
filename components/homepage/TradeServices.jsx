"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TradeServices = ({ services }) => {
  return (
    <section className='py-16'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='text-3xl font-bold mb-4'>Trade Services</h2>
        <p className='text-gray-600 mb-12'>
          We provide comprehensive trade services to ensure a safe and efficient
          purchasing experience for global buyers.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {services.map((svc) => (
            <Card key={svc.id} className='text-center'>
              <CardContent>
                <div className='w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center'>
                  <i className={`fas fa-${svc.icon} text-2xl text-blue-600`} />
                </div>
                <h3 className='text-xl font-semibold'>{svc.title}</h3>
                <p className='text-gray-600'>{svc.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TradeServices;
