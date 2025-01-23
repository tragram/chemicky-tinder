import DefaultLayout from "@/layouts/default";
import TinderCard from "@/components/TinderCard";
import data from '@/dating_profiles.yaml';

export default function DatingPage() {
  console.log(data)
  return (
    <DefaultLayout>
      <div className="flex w-screen h-screen items-center justify-center">
        <TinderCard item={data[1]} onSwipe={undefined} />
      </div>
    </DefaultLayout>
  )
}
