"use client";

import { useParams } from "next/navigation";
import ProductoVista from "@/components/ProductoVista";

export default function Page() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <section className="container mx-auto px-4 mt-50 mb-20">
      <ProductoVista id={id} />
    </section>
  );
}
