export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E8F0] dark:border-[#2A2A2A] overflow-hidden">
      {/* Image skeleton */}
      <div className="h-48 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#2A2A2A] dark:via-[#333] dark:to-[#2A2A2A] animate-shimmer bg-[length:200%_100%]" />

      <div className="p-4 space-y-3">
        {/* Badge skeleton */}
        <div className="w-20 h-5 rounded-full bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />

        {/* Titre skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />
          <div className="w-3/4 h-4 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />
        </div>

        {/* Localisation skeleton */}
        <div className="w-1/2 h-3 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />

        {/* Prix skeleton */}
        <div className="w-1/3 h-6 rounded-lg bg-[#EBF5ED] dark:bg-[#2A2A2A] animate-pulse" />

        {/* Caractéristiques skeleton */}
        <div className="flex gap-3 pt-2 border-t border-[#E2E8F0] dark:border-[#2A2A2A]">
          <div className="w-16 h-3 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />
          <div className="w-16 h-3 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />
          <div className="w-16 h-3 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />
        </div>
      </div>
    </div>
  );
}