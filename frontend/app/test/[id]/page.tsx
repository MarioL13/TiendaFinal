"use client";

import { useParams } from "next/navigation";
import ProductoVista from "@/components/ProductoVista";

export default function Page() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <section className="container mx-auto px-4 mt-42 mb-22 flex justify-center items-center">
      <ProductoVista id={id} />
    </section>
  );
}
