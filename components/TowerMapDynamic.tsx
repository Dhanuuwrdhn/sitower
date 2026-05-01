import dynamic from "next/dynamic";

const TowerMapDynamic = dynamic(() => import("./TowerMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
      <p className="text-sm text-slate-400">Memuat peta...</p>
    </div>
  ),
});

export default TowerMapDynamic;
