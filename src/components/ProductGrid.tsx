import { Children, type ReactNode } from "react";

export default function ProductGrid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        grid grid-cols-1 gap-4

        md:flex md:flex-nowrap md:gap-4 md:overflow-x-auto md:pb-2
        md:[scrollbar-width:thin] md:snap-x md:snap-mandatory

        xl:grid xl:grid-cols-2 xl:overflow-visible xl:pb-0 xl:snap-none
      "
    >
      {Children.map(children, (child) => (
        <div
          className="
            md:w-[320px] md:flex-none md:snap-start
            xl:w-auto
          "
        >
          {child}
        </div>
      ))}
    </div>
  );
}