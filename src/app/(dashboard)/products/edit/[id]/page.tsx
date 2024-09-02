"use client";

import { editProduct, fetchDetailProduct } from "@/app/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AddProducts = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dataForm, setDataForm] = useState({
    title: "",
    description: "",
    price: 0,
  });

  const mutation = useMutation({
    mutationFn: (event) => {
      event.preventDefault();
      return editProduct(1, dataForm);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product has been edited",
      });

      setTimeout(() => {
        router.push("/products");
      }, 1000);
    },
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["dataForm"],
    queryFn: async () => {
      const response = await fetchDetailProduct(Number(params.id));
      return response;
    },
  });

  useEffect(() => {
    if (data) {
      setDataForm({
        title: data.title,
        description: data.description,
        price: data.price,
      });
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen animate-pulse">
        Loading...
      </div>
    );

  if (error) return <div>Error occurred while fetching data.</div>;

  return (
    <div className="container">
      <h1 className="text-xl mb-2 font-semibold">Edit Product</h1>

      <form className="flex flex-col gap-3" onSubmit={mutation.mutate}>
        <div>
          <Label>Title</Label>
          <Input
            value={dataForm.title}
            onChange={(e) =>
              setDataForm({ ...dataForm, title: e.target.value })
            }
            name="title"
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={dataForm.description}
            onChange={(e) =>
              setDataForm({ ...dataForm, description: e.target.value })
            }
            name="description"
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            value={dataForm.price}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]+/g, "");
              setDataForm({ ...dataForm, price: Number(e.target.value) });
            }}
            name="price"
          />
        </div>
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
      <Toaster />
    </div>
  );
};

export default AddProducts;
