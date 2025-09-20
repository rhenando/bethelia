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

  const convertValue = (value) => {
    // Handle null or undefined
    if (value === null || value === undefined) {
      return value;
    }

    // Handle Firestore Timestamp objects
    if (value && typeof value.toDate === "function") {
      return value.toDate().toISOString();
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(convertValue);
    }

    // Handle nested objects
    if (typeof value === "object" && value.constructor === Object) {
      const converted = {};
      for (const key in value) {
        converted[key] = convertValue(value[key]);
      }
      return converted;
    }

    // Return primitive values as-is
    return value;
  };

  return convertValue(data);
};

/**
 * Check if a user exists in a specific collection
 */
export const checkUserExists = async (uid, collection) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, collection, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error(`Error checking user existence in ${collection}:`, error);
    throw error;
  }
};

/**
 * Create a new buyer account
 */
export const createBuyerAccount = async (user) => {
  try {
    console.log("🔄 Creating buyer account for:", user.uid);
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

    console.log("🔄 Writing buyer data to Firestore...");
    await setDoc(buyerRef, buyerData);
    console.log("✅ Buyer account created successfully");

    // For new accounts, convert server timestamps to current time for immediate use
    const nowISO = new Date().toISOString();
    const dataForRedux = {
      ...buyerData,
      createdAt: nowISO,
      updatedAt: nowISO,
      lastLoginAt: nowISO,
    };

    console.log("✅ Converted timestamps for Redux storage");
    return dataForRedux;
  } catch (error) {
    console.error("❌ Error creating buyer account:", error);
    throw new Error(`Failed to create buyer account: ${error.message}`);
  }
};

/**
 * Create a new seller account
 */
export const createSellerAccount = async (user, additionalInfo = {}) => {
  try {
    console.log("🔄 Creating seller account for:", user.uid);
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

    console.log("🔄 Writing seller data to Firestore...");
    await setDoc(sellerRef, sellerData);
    console.log("✅ Seller account created successfully");

    // For new accounts, convert server timestamps to current time for immediate use
    const nowISO = new Date().toISOString();
    const dataForRedux = {
      ...sellerData,
      createdAt: nowISO,
      updatedAt: nowISO,
      lastLoginAt: nowISO,
    };

    console.log("✅ Converted timestamps for Redux storage");
    return dataForRedux;
  } catch (error) {
    console.error("❌ Error creating seller account:", error);
    throw new Error(`Failed to create seller account: ${error.message}`);
  }
};

/**
 * Get buyer data or create if doesn't exist
 */
export const getOrCreateBuyer = async (user) => {
  try {
    console.log("🔄 getOrCreateBuyer called for:", user.uid);

    if (!user || !user.uid) {
      throw new Error("Invalid user object provided");
    }

    const db = getFirestore();
    const buyerRef = doc(db, "buyers", user.uid);

    console.log("🔄 Checking if buyer exists in Firestore...");
    const buyerSnap = await getDoc(buyerRef);

    if (buyerSnap.exists()) {
      console.log("✅ Existing buyer found, updating last login");

      // Update last login
      await setDoc(
        buyerRef,
        {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const rawData = buyerSnap.data();
      const convertedData = convertTimestamps(rawData);

      console.log("✅ Returning existing buyer data");
      return { data: convertedData, isNew: false };
    } else {
      console.log("📝 No existing buyer found, creating new account");
      const buyerData = await createBuyerAccount(user);
      console.log("✅ New buyer account created and returning data");
      return { data: buyerData, isNew: true };
    }
  } catch (error) {
    console.error("❌ Error in getOrCreateBuyer:", {
      message: error.message,
      stack: error.stack,
      userUid: user?.uid,
      userEmail: user?.email,
    });

    // More specific error messages
    if (error.code === "permission-denied") {
      throw new Error(
        "Permission denied. Please check your Firebase security rules."
      );
    } else if (error.code === "unavailable") {
      throw new Error(
        "Firestore service is temporarily unavailable. Please try again."
      );
    } else if (error.message.includes("Failed to create buyer account")) {
      throw error; // Already has a good message
    } else {
      throw new Error(
        `Failed to get or create buyer account: ${error.message}`
      );
    }
  }
};

/**
 * Get seller data or create if doesn't exist
 */
export const getOrCreateSeller = async (user, additionalInfo = {}) => {
  try {
    console.log("🔄 getOrCreateSeller called for:", user.uid);

    if (!user || !user.uid) {
      throw new Error("Invalid user object provided");
    }

    const db = getFirestore();
    const sellerRef = doc(db, "sellers", user.uid);

    console.log("🔄 Checking if seller exists in Firestore...");
    const sellerSnap = await getDoc(sellerRef);

    if (sellerSnap.exists()) {
      console.log("✅ Existing seller found, updating last login");

      await setDoc(
        sellerRef,
        {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const rawData = sellerSnap.data();
      const convertedData = convertTimestamps(rawData);

      console.log("✅ Returning existing seller data");
      return { data: convertedData, isNew: false };
    } else {
      console.log("📝 No existing seller found, creating new account");
      const sellerData = await createSellerAccount(user, additionalInfo);
      console.log("✅ New seller account created and returning data");
      return { data: sellerData, isNew: true };
    }
  } catch (error) {
    console.error("❌ Error in getOrCreateSeller:", {
      message: error.message,
      stack: error.stack,
      userUid: user?.uid,
      userEmail: user?.email,
    });

    // More specific error messages
    if (error.code === "permission-denied") {
      throw new Error(
        "Permission denied. Please check your Firebase security rules."
      );
    } else if (error.code === "unavailable") {
      throw new Error(
        "Firestore service is temporarily unavailable. Please try again."
      );
    } else if (error.message.includes("Failed to create seller account")) {
      throw error; // Already has a good message
    } else {
      throw new Error(
        `Failed to get or create seller account: ${error.message}`
      );
    }
  }
};

/**
 * Check user type across collections
 */
export const checkUserType = async (uid) => {
  try {
    const isBuyer = await checkUserExists(uid, "buyers");
    const isSeller = await checkUserExists(uid, "sellers");
    return { isBuyer, isSeller };
  } catch (error) {
    console.error("Error checking user type:", error);
    throw new Error(`Failed to check user type: ${error.message}`);
  }
};
