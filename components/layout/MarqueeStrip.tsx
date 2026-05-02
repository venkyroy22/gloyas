export default function MarqueeStrip() {
  const text =
    'FREE SHIPPING OVER ₹999  ★  NEW ARRIVALS WEEKLY  ★  EASY RETURNS  ★  PREMIUM QUALITY  ★  ';

  return (
    <div className="w-full bg-[#111111] py-2.5 sm:py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="text-white text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mx-0 inline-block"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
