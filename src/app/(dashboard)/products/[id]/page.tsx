import { fetchDetailProduct } from "@/app/api/products";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  // ssr fetch
  const data = await fetchDetailProduct(params.id);

  return {
    title: data.title,
  };
}

const DetailProduct = async ({ params }: { params: { id: number } }) => {
  // ssr fetch
  const data = await fetchDetailProduct(params.id);

  if (data.message)
    return (
      <div className="container">Product with id {params.id} not found</div>
    );

  return (
    <div className="container grid md:grid-cols-2 gap-4">
      <img
        className="border rounded-md w-full"
        src={data?.thumbnail}
        alt="thumbnail"
      />
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">{data?.title}</h1>
        <p className="text-gray-500">{data?.description}</p>
        <p>Rating: {data?.rating}</p>
        <p>Brand: {data?.brand ?? "-"}</p>
        <p>Category: {data?.category}</p>
        <p>Price: ${data?.price}</p>
      </div>
    </div>
  );
};

export default DetailProduct;
