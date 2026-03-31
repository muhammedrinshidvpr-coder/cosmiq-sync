import TopNav from "@/components/TopNav";
import CodePanel from "@/components/CodePanel";
import AssetPanel from "@/components/AssetPanel";
import SyncButton from "@/components/SyncButton";

const Index = () => (
  <div className="min-h-screen bg-space relative overflow-hidden flex flex-col">
    {/* Watermark Logo */}
    <div className="watermark-logo top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 whitespace-nowrap">
      CosmIQ
    </div>

    {/* Ambient glow orbs */}
    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[100px] pointer-events-none" />

    <div className="relative z-10 flex flex-col flex-1">
      <TopNav />

      <main className="flex-1 flex flex-col gap-8 px-4 md:px-10 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[400px]">
          <CodePanel />
          <AssetPanel />
        </div>

        <div className="pb-8">
          <SyncButton />
        </div>
      </main>
    </div>
  </div>
);

export default Index;
