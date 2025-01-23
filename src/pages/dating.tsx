import DefaultLayout from "@/layouts/default";
import data from '@/dating_profiles.yaml';
import TinderStack from "@/components/TinderStack";

export default function DatingPage() {
  console.log(data)
  return (
    <DefaultLayout>
      <div className="flex w-screen h-screen items-center justify-center p-8">
        <TinderStack profiles={data} />
      </div>
    </DefaultLayout>
  )
}
