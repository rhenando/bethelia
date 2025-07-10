import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, "categories"), orderBy("order"));
        const snap = await getDocs(q);
        setCategories(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { categories, loading };
}
