import { useQuery, useMutation } from 'react-query';
import { getFlightById } from '@/services/gestion-vuelos-b/flights';
import { updateFlight } from '@/services/gestion-vuelos-b/flights';
import { FlightPayload } from '@/services/gestion-vuelos-b/types';
import Navbar from '@/components/navbar';
import {FlightForm} from '@/components/gestion-vuelos-b/flight-form';
import { useRouter } from 'next/router';

export default function EditFlight() {
  const router = useRouter();
  const {flightId} = router.query;
  
  const {data, isSuccess} = useQuery({
    queryFn: () => getFlightById(flightId as string),
    queryKey: ["flight", flightId]
  })

  const mutation = useMutation({
    mutationFn: async (data: FlightPayload) => {
      return await updateFlight({id: flightId as string, ...data});
    },
    onSuccess: () => {
      router.push('/gestion-vuelos-b/flights');
    }
  });
  
  return (
    <>
    <Navbar />
    <div className="w-full p-4 sm:p-12">
      <h1 className="text-4xl font-bold">Editar vuelo</h1>
    </div>
    {isSuccess && <FlightForm sendDataMutation={mutation} flight={data} />}
  </>
  );
}