"use client";

import { addProduct } from "@/app/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddProducts = () => {
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
      return addProduct(dataForm);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product has been saved",
      });

      setTimeout(() => {
        router.push("/products");
      }, 1000);
    },
  });

  return (
    <div className="container">
      <h1 className="text-xl mb-2 font-semibold">Add Product</h1>

      <form className="flex flex-col gap-3" onSubmit={mutation.mutate}>
        {/* On submission, the input value will be appended to 
          the URL, e.g. /search?query=abc */}
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
