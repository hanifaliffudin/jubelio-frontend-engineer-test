"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { deleteProduct, fetchProducts } from "@/app/api/products";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, ProductApiResponse } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const ListProducts = () => {
  const router = useRouter();
  const pageSize = 30;

  // ref container table for infinite scroll
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // columns table
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link
            className="text-blue-500 font-semibold"
            href={"/products/" + row.original.id}
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <p className="line-clamp-1">{row.original.description}</p>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => "$" + info.getValue(),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="h-8 w-8 flex items-center justify-center">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-end">
                <DropdownMenuItem
                  onClick={() => handleAddToCart(row.original)}
                  className="cursor-pointer"
                >
                  Add to Cart
                </DropdownMenuItem>
                <Link href={"/products/edit/" + row.original.id}>
                  <DropdownMenuItem className="cursor-pointer">
                    Edit
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => handleDelete(row.original.id)}
                  className="cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  // react query using useInfiniteQuery for infinite scroll
  const { data, fetchNextPage, isFetching, isLoading, error } =
    useInfiniteQuery<ProductApiResponse>({
      queryKey: ["products"],
      queryFn: async ({ pageParam }) => {
        const fetchedData = await fetchProducts(pageSize, Number(pageParam));
        return fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

  // flatten the array of arrays from the useInfiniteQuery hook
  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.products) ?? [],
    [data],
  );

  // total all products
  const totalDBRowCount = data?.pages?.[0]?.total ?? 0;

  // total data already fetched
  const totalFetched = flatData.length;

  // fetch next page if touch bottom
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 100 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  // a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  // react table
  const tableProducts = useReactTable({
    data: flatData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    debugTable: true,
  });

  // get func addtocart from zustand store
  const { addToCart } = useCartStore();

  const { token } = useAuthStore();

  // if no token, redirect to login
  if (data && !token) router.push("/");

  // add product to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  // delete product
  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);

      toast({
        title: "Success",
        description: "Product has been deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen animate-pulse">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <div
      className="container overflow-auto relative h-screen"
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      ref={tableContainerRef}
    >
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-xl mb-2 font-semibold">Products</h1>

        <Link href="/products/add">
          <Button>Add</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          {tableProducts.getHeaderGroups().map((headerGroup) => (
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
          {tableProducts.getRowModel().rows.map((row) => (
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
      <Toaster />
      {isFetching && (
        <div className="text-center m-2 text-gray-500 animate-pulse">
          Fetching More...
        </div>
      )}
    </div>
  );
};

export default ListProducts;
