export default function SkeletonCard() {
  return (
    <div
      className="bg-white dark:bg-[#161616] rounded-[20px] border border-[#F0F0F0] dark:border-[#262626] overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)' }}
    >
      {/* Image skeleton */}
      <div className="h-52 bg-gradient-to-r from-[#F0F0F0] via-[#F8F8F8] to-[#F0F0F0] dark:from-[#1F1F1F] dark:via-[#2A2A2A] dark:to-[#1F1F1F] animate-shimmer bg-[length:200%_100%]" />

      <div className="p-4 space-y-3">
        {/* Localisation skeleton */}
        <div className="w-2/5 h-3 rounded-full bg-[#F5F5F7] dark:bg-[#232323] animate-shimmer bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#232323] dark:via-[#2E2E2E] dark:to-[#232323] bg-[length:200%_100%]" />

        {/* Titre skeleton */}
        <div className="space-y-2 pt-1">
          <div className="w-full h-4 rounded-lg bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#232323] dark:via-[#2E2E2E] dark:to-[#232323] animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.1s' }} />
          <div className="w-3/4 h-4 rounded-lg bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#232323] dark:via-[#2E2E2E] dark:to-[#232323] animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.15s' }} />
        </div>

        {/* Specs skeleton */}
        <div className="flex gap-3 pb-3 pt-1 border-b border-[#F0F0F0] dark:border-[#262626]">
          <div className="w-14 h-3 rounded-full bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#232323] dark:via-[#2E2E2E] dark:to-[#232323] animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.2s' }} />
          <div className="w-14 h-3 rounded-full bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#232323] dark:via-[#2E2E2E] dark:to-[#232323] animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.25s' }} />
          <div className="w-14 h-3 rounded-full bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#232323] dark:via-[#2E2E2E] dark:to-[#232323] animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Prix + avatar skeleton */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1.5">
            <div className="w-24 h-5 rounded-lg bg-gradient-to-r from-[#DCEEE0] via-[#EBF5ED] to-[#DCEEE0] dark:from-[#1A2E20] dark:via-[#223A28] dark:to-[#1A2E20] animate-shimmer bg-[length:200%_100%]" />
            <div className="w-14 h-2.5 rounded-full bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#232323] dark:via-[#2E2E2E] dark:to-[#232323] animate-shimmer bg-[length:200%_100%]" />
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] dark:from-[#232323] dark:via-[#2E2E2E] dark:to-[#232323] animate-shimmer bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
}