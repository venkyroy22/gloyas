interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'sale';
  className?: string;
}

export default function Badge({ children, variant = 'new', className = '' }: BadgeProps) {
  const variants = {
    new: 'bg-gradient-to-r from-[#0080FF] to-[#59A9F8] text-white',
    sale: 'bg-red-500 text-white',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
