"use client";

import { fetchCarts } from "@/app/api/cart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

const Carts = () => {
  const router = useRouter();
  const triggerModal = useRef(null);
  const [pagination, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({
    pageIndex: 0,
    pageSize: 30,
  });

  const [dataModal, setDataModal] = useState({
    products: [],
    totalProducts: 0,
    totalQuantity: 0,
    total: 0,
  });

  const openModal = (id?: number) => {
    triggerModal?.current?.click();

    if (id) {
      setDataModal({
        ...data.carts.find((cart: { id: number }) => {
          return cart.id === id;
        }),
      });
    } else {
      setDataModal({
        products: items,
        totalProducts: items.length,
        totalQuantity: totalQuantity,
        total: totalPrice,
      });
      // setDataModal
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "products",
        header: "Products",
        cell: ({
          row,
        }: {
          row: { original: { products: Product[]; id: number } };
        }) => (
          <div className="line-clamp-4 w-fit cursor-pointer">
            {row.original.products.map((product: Product, i: number) => (
              <p
                key={product.id}
                className="text-nowrap text-blue-500 font-semibold"
                onClick={() => openModal(row.original.id)}
              >
                {product.title}
                {i === row.original.products.length - 1 ? "" : ","}
              </p>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "totalProducts",
        header: "Total Products",
      },
      {
        accessorKey: "totalQuantity",
        header: "Total Quantity",
      },
      {
        accessorKey: "discountedTotal",
        header: "Discounted Total",
        cell: (info) => "$" + info.getValue(),
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: (info) => "$" + info.getValue(),
      },
    ],
    [],
  );

  const { isLoading, error, data } = useQuery({
    queryKey: ["cart", pagination],
    queryFn: async () => {
      const response = await fetchCarts(
        pagination.pageSize,
        pagination.pageIndex,
      );
      return response;
    },
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });

  const table = useReactTable({
    data: data?.carts ?? [],
    columns,
    rowCount: data?.total, // new in v8.13.0 - alternatively, just pass in `pageCount` directly
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, //we're doing manual "server-side" pagination
    debugTable: true,
  });

  const { items, totalPrice, totalQuantity } = useCartStore();

  const { token } = useAuthStore();

  // if no token, redirect to login
  if (data && !token) router.push("/");

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen animate-pulse">
        Loading...
      </div>
    );

  if (error) return <div>Error occurred while fetching data.</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-semibold">Carts</h1>
        <Button onClick={() => openModal()}>My Cart</Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button hidden ref={triggerModal}></button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Product</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataModal.products.map((product: Product, i: number) => (
                    <TableRow key={i}>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>Total: ${dataModal.total}</div>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent className="mb-4">
          <PaginationItem>
            {table.getCanPreviousPage() && (
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => table.previousPage()}
              />
            )}
          </PaginationItem>

          {table.getCanNextPage() && (
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => table.nextPage()}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Carts;
