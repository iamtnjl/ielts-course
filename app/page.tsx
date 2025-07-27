import { dehydrate } from "@tanstack/react-query";
import getQueryClient from "../common/tanstack/getQueryClient";
import HydrationBoundary from "../common/tanstack/HydrationBoundary";
import RootContainer from "../components/home/RootContainer";
import APIKit from "@/common/helpers/APIKit";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["home-data"],
    queryFn: async () => {
      const response = await APIKit.public.getCourse()
      return response.data
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RootContainer />
    </HydrationBoundary>
  );
}
