import OrderReview from "./components/OrderReview";
import OrderCheckout from "./components/OrderCheckout";

export default function BundleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-[1600px] p-0 md:p-6 xl:p-8">
        <div
          className="
            grid
            grid-cols-1
            gap-6

            xl:grid-cols-[minmax(0,1fr)_520px]
            xl:gap-8
          "
        >
          {/* Main Content */}
          <section className="min-w-0">
            {children}
          </section>

          {/* Right Side Panel */}
          <aside
            className="
              grid
              grid-cols-1
              gap-6

              lg:grid-cols-2

              xl:grid-cols-1
              bg-[#edf4ff]
              rounded-xl
            "
          >
            {/* Review Panel */}
            <section><OrderReview /></section>

            {/* Checkout Panel */}
            <section><OrderCheckout /></section>
          </aside>
        </div>
      </div>
    </main>
  );
}