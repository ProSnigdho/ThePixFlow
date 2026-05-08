import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  QueryConstraint,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/firebase/config';

/**
 * PRODUCTION-READY: Safe Firestore Hook
 * Automatically handles subscriptions and cleanup on unmount
 * to prevent "User aborted" crashes during navigation.
 */
export function useFirestore<T = DocumentData>(
  collectionName: string, 
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const q = query(collection(db, collectionName), ...constraints);

    // onSnapshot returns an unsubscribe function
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (!isMounted) return;
        const result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(result);
        setLoading(false);
      },
      (err) => {
        if (!isMounted) return;
        if (err.message.includes('INTERNAL ASSERTION FAILED')) return;
        console.error(`Firestore Error [${collectionName}]:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // CLEANUP: This is critical for preventing navigation crashes
    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [collectionName, constraints.length]); // Use length as a simple trigger, or keep previous logic if stable

  return { data, loading, error };
}
