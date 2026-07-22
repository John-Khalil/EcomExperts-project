export default function BundleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">

      <div
        className="
          grid
          grid-cols-1
          gap-6

          md:grid-cols-2

          lg:grid-cols-3
          lg:gap-8
        "
      >

        {/* Stepper Section */}
        <section
          className="
            col-span-1

            md:col-span-2

            lg:col-span-2
          "
        >
          {children}
        </section>


        {/* Right Side Panel */}
        <aside
          className="
            grid
            grid-cols-1
            gap-6

            md:grid-cols-2

            lg:grid-cols-1
          "
        >

          {/* Review Panel */}
          <section>
            Review Panel
          </section>


          {/* Checkout Panel */}
          <section>
            Checkout Panel
          </section>

        </aside>

      </div>

    </main>
  );
}