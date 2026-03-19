import { getAllFlowersWithProfiles } from "@/lib/flowers"
import { InteractiveGarden } from "@/components/home/InteractiveGarden"

export const revalidate = 60 // Revalidate cached garden every 60s

export default async function LandingPage() {
  const plantedFlowers = await getAllFlowersWithProfiles(50)

  return <InteractiveGarden plantedFlowers={plantedFlowers as any} />
}
