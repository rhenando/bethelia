"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, User, Heart, ShoppingCart } from "lucide-react";
import { Listbox, Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { clearUser } from "@/store/authSlice";
import MobileHeader from "./MobileBottomNav";
import Link from "next/link";

// Philippine locations
const defaultLocations = [
  { id: 1, name: "Manila" },
  { id: 2, name: "Cebu" },
  { id: 3, name: "Davao" },
];

// Sample menu items
const suppliers = ["Supplier One", "Supplier Two", "Supplier Three"];
const categoriesList = [
  "Electronics",
  "Men's Fashion",
  "Women's Fashion",
  "Kids' Fashion",
  "Home & Kitchen",
  "Beauty & Fragrance",
  "Baby",
  "Toys",
  "Sports & Outdoors",
];

// Stub for reverse geocoding
async function fetchCityFromCoords(lat, lon) {
  return "Manila";
}

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [locations] = useState(defaultLocations);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          try {
            const city = await fetchCityFromCoords(latitude, longitude);
            const match = locations.find((l) => l.name === city);
            setSelectedLocation(match || { id: 0, name: city });
          } catch {}
        }
      );
    }
  }, [locations]);

  const handleLogout = () => {
    dispatch(clearUser());
    window.location.href = "/";
  };

  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    if (user?.phone) return user.phone;
    return "User";
  };

  // Determine dashboard path
  const dashboardPath =
    user?.role === "supplier" ? "/supplier-dashboard" : "/buyer-dashboard";

  return (
    <>
      <header className='hidden md:block'>
        <div className='bg-primary text-white'>
          <div className='max-w-7xl mx-auto flex items-center h-14 px-4 sm:px-6 lg:px-8'>
            <Link href='/' className='flex-shrink-0 text-2xl font-bold'>
              Bethelia
            </Link>

            <div className='ml-6 relative'>
              <Listbox value={selectedLocation} onChange={setSelectedLocation}>
                <Listbox.Button className='inline-flex items-center space-x-1 cursor-pointer text-sm hover:underline'>
                  <span>Deliver to {selectedLocation.name}</span>
                  <ChevronDown className='h-4 w-4' />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute mt-1 w-40 bg-white text-gray-800 shadow-lg rounded z-10'>
                    {locations.map((loc) => (
                      <Listbox.Option key={loc.id} value={loc}>
                        {({ selected, active }) => (
                          <div
                            className={`cursor-pointer px-3 py-2 ${
                              active ? "bg-primary/10" : ""
                            }`}
                          >
                            <span className={selected ? "font-semibold" : ""}>
                              {loc.name}
                            </span>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>

            <div className='flex-1 mx-6'>
              <input
                type='text'
                placeholder='What are you looking for?'
                className='w-full h-10 px-4 rounded bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>

            <div className='flex items-center space-x-4'>
              {user ? (
                <HeadlessMenu
                  as='div'
                  className='relative inline-block text-left'
                >
                  <HeadlessMenu.Button className='flex items-center space-x-1 text-sm hover:underline'>
                    <User className='h-5 w-5' />
                    <span>Hi, {getDisplayName()}</span>
                    <ChevronDown className='h-4 w-4' />
                  </HeadlessMenu.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                  >
                    <HeadlessMenu.Items className='absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded z-10'>
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <a
                            href={dashboardPath}
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-primary/10 text-primary" : ""
                            }`}
                          >
                            My Dashboard
                          </a>
                        )}
                      </HeadlessMenu.Item>
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`w-full text-left block px-4 py-2 text-sm ${
                              active ? "bg-primary/10 text-primary" : ""
                            }`}
                          >
                            Logout
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              ) : (
                <button
                  className='flex items-center space-x-1 text-sm hover:underline'
                  onClick={() => (window.location.href = "/login")}
                >
                  <User className='h-5 w-5' />
                  <span>Log in</span>
                </button>
              )}

              {!user?.role && (
                <a
                  href='/signup'
                  className='inline-block bg-white text-primary font-semibold text-sm px-3 py-1 rounded hover:bg-gray-100 transition'
                >
                  Become a Supplier
                </a>
              )}

              <button className='hover:text-red-400'>
                <Heart className='h-5 w-5' />
              </button>

              <button className='relative hover:text-gray-200'>
                <ShoppingCart className='h-5 w-5' />
                <span className='absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1'>
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className='bg-white border-t hidden md:block'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <ul className='flex space-x-6 overflow-x-auto py-2'>
            {/* All Suppliers */}
            <li className='whitespace-nowrap'>
              <HeadlessMenu
                as='div'
                className='relative inline-block text-left'
              >
                <HeadlessMenu.Button className='inline-flex items-center text-sm font-bold text-primary hover:underline'>
                  All Suppliers
                  <ChevronDown className='h-4 w-4 ml-1' />
                </HeadlessMenu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                  <HeadlessMenu.Items className='absolute mt-2 w-48 bg-white shadow-lg rounded z-10'>
                    {suppliers.map((sup) => (
                      <HeadlessMenu.Item key={sup}>
                        {({ active }) => (
                          <a
                            href='#'
                            className={`block px-4 py-2 text-sm ${
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-gray-700"
                            }`}
                          >
                            {sup}
                          </a>
                        )}
                      </HeadlessMenu.Item>
                    ))}
                  </HeadlessMenu.Items>
                </Transition>
              </HeadlessMenu>
            </li>

            {/* All Categories */}
            <li className='whitespace-nowrap'>
              <HeadlessMenu
                as='div'
                className='relative inline-block text-left'
              >
                <HeadlessMenu.Button className='inline-flex items-center text-sm font-bold text-primary hover:underline'>
                  All Categories
                  <ChevronDown className='h-4 w-4 ml-1' />
                </HeadlessMenu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                  <HeadlessMenu.Items className='absolute mt-2 w-48 bg-white shadow-lg rounded z-10'>
                    {categoriesList.map((cat) => (
                      <HeadlessMenu.Item key={cat}>
                        {({ active }) => (
                          <a
                            href='#'
                            className={`block px-4 py-2 text-sm ${
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-gray-700"
                            }`}
                          >
                            {cat}
                          </a>
                        )}
                      </HeadlessMenu.Item>
                    ))}
                  </HeadlessMenu.Items>
                </Transition>
              </HeadlessMenu>
            </li>

            {/* Other categories */}
            {categoriesList.map((cat) => (
              <li key={cat} className='whitespace-nowrap'>
                <a
                  href='#'
                  className='text-sm text-gray-700 hover:text-primary'
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <MobileHeader />
    </>
  );
}
