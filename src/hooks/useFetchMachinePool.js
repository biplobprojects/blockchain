import { useEffect, useState } from 'react';
import { fetchMachineData } from '../api/machinePoolApi';

const useFetchMachinePool = (parent) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchMachineData(parent);
        console.log(result, "FETCH ALL MACHINE DATA;;;;;;;;;;;;;");
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [parent]);

  return { data, loading, error };
};

export default useFetchMachinePool;
