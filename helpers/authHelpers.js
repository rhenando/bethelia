// helpers/authHelpers.js
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "@/lib/firebase";

/**
 * Converts Firestore Timestamp objects in a data object to ISO strings.
 * This makes the data "serializable" and safe to store in Redux.
 * @param {object} data The object to process.
 * @returns {object} A new object with timestamps converted to strings.
 */
export const convertTimestamps = (data) => {
  if (!data) return data;
  const convertedData = { ...data };
  for (const key in convertedData) {
    // Check if the value is a Firestore Timestamp
    if (convertedData[key] && typeof convertedData[key].toDate === "function") {
      convertedData[key] = convertedData[key].toDate().toISOString();
    }
  }
  return convertedData;
};

/**
 * Check if a user exists in a specific collection
 */
export const checkUserExists = async (uid, collection) => {
  const db = getFirestore();
  const userRef = doc(db, collection, uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists();
};

/**
 * Create a new buyer account
 */
export const createBuyerAccount = async (user) => {
  const db = getFirestore();
  const buyerRef = doc(db, "buyers", user.uid);

  const buyerData = {
    uid: user.uid,
    email: user.email || null,
    phoneNumber: user.phoneNumber || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    shippingAddresses: [],
    savedPaymentMethods: [],
    wishlist: [],
    recentlyViewed: [],
    followedStores: [],
    totalOrders: 0,
    totalSpent: 0,
    currency: "SAR",
    preferences: {
      language: "en",
      currency: "SAR",
      emailNotifications: true,
      smsNotifications: true,
      orderUpdates: true,
      promotions: false,
    },
    status: "active",
    emailVerified: user.emailVerified || false,
    phoneVerified: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(buyerRef, buyerData);
  return buyerData;
};

/**
 * Create a new seller account
 */
export const createSellerAccount = async (user, additionalInfo = {}) => {
  const db = getFirestore();
  const sellerRef = doc(db, "sellers", user.uid);

  const sellerData = {
    uid: user.uid,
    email: user.email || null,
    phoneNumber: user.phoneNumber || null,
    storeName: additionalInfo.storeName || null,
    storeSlug: null,
    storeDescription: null,
    storeLogo: null,
    storeBanner: null,
    businessDetails: {
      legalName: null,
      businessType: "individual",
      registrationNumber: null,
      vatNumber: null,
      address: {},
    },
    verificationStatus: "pending",
    verificationDocuments: [],
    verifiedAt: null,
    bankAccount: null,
    stripeAccountId: null,
    stripeAccountStatus: null,
    metrics: {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalReviews: 0,
      responseTime: null,
      fulfillmentRate: 0,
    },
    policies: {
      returnPeriod: 14,
      shippingMethods: ["standard"],
      refundPolicy: null,
      warrantyInfo: null,
    },
    categories: [],
    status: "active",
    suspensionReason: null,
    subscriptionPlan: "basic",
    subscriptionExpiresAt: null,
    features: ["basic_upload"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    lastSaleAt: null,
  };

  await setDoc(sellerRef, sellerData);
  return sellerData;
};

/**
 * Get buyer data or create if doesn't exist
 */
export const getOrCreateBuyer = async (user) => {
  const db = getFirestore();
  const buyerRef = doc(db, "buyers", user.uid);
  const buyerSnap = await getDoc(buyerRef);

  if (buyerSnap.exists()) {
    await setDoc(buyerRef, { lastLoginAt: serverTimestamp() }, { merge: true });
    return { data: buyerSnap.data(), isNew: false };
  } else {
    const buyerData = await createBuyerAccount(user);
    return { data: buyerData, isNew: true };
  }
};

/**
 * Get seller data or create if doesn't exist
 */
export const getOrCreateSeller = async (user, additionalInfo = {}) => {
  const db = getFirestore();
  const sellerRef = doc(db, "sellers", user.uid);
  const sellerSnap = await getDoc(sellerRef);

  if (sellerSnap.exists()) {
    await setDoc(
      sellerRef,
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    );
    return { data: sellerSnap.data(), isNew: false };
  } else {
    const sellerData = await createSellerAccount(user, additionalInfo);
    return { data: sellerData, isNew: true };
  }
};

/**
 * Check user type across collections
 */
export const checkUserType = async (uid) => {
  const isBuyer = await checkUserExists(uid, "buyers");
  const isSeller = await checkUserExists(uid, "sellers");
  return { isBuyer, isSeller };
};
