import { useEffect, useState } from "react";

// type FnProps = {
//   fetchFn: () => Promise<T[]>;
//   createFn: (data: any) => Promise<T>;
//   updateFn: (id: number, data: any) => Promise<T>;
//   deleteFn: (id: number) => Promise<boolean>;
// };
export function useCrud<T>({
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
}: {
  fetchFn: () => Promise<T[]>;
  createFn: (data: any) => Promise<T>;
  updateFn: (id: number, data: any) => Promise<T>;
  deleteFn: (id: number) => Promise<boolean>;
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn().then((res) => {
      setData(res ?? []);
      setLoading(false);
    });
  }, []);

  const createItem = async (item: any) => {
    const res = await createFn(item);
    setData((prev) => [...prev, res]);
  };

  const updateItem = async (id: number, item: any) => {
    const res = await updateFn(id, item);
    setData((prev) => prev.map((r: any) => (r.id === id ? res : r)));
  };

  const deleteItem = async (id: number) => {
    await deleteFn(id);
    setData((prev) => prev.filter((r: any) => r.id !== id));
  };

  return { data, loading, createItem, updateItem, deleteItem };
}
