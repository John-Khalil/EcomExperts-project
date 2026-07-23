import { Children, type ReactNode } from "react";

export default function ProductGrid({ children }: {children: ReactNode}) {
  return (
    <div
      className="
        grid grid-cols-1 gap-4

        md:flex md:flex-nowrap md:gap-4 md:overflow-x-auto md:pb-2
        md:[scrollbar-width:thin] md:snap-x md:snap-mandatory

        lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0 lg:snap-none
      "
    >
      {Children.map(children, (child) => (
        <div
          className="
            md:w-[320px] md:flex-none md:snap-start
            lg:w-auto
          "
        >
          {child}
        </div>
      ))}
    </div>
  );
}