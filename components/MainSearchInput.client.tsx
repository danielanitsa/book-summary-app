// components/MainSearchInput.client.tsx

"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ClientSearchInputProps {
  placeholder: string;
}

const ClientSearchInput: React.FC<ClientSearchInputProps> = ({
  placeholder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useParams<{ query: string; page: string }>();

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const encodedQuery = encodeURIComponent(searchQuery.trim()).toString();

      if (!encodedQuery) return;
      console.log(encodedQuery);
      router.push(`/search/${encodedQuery}/page/1`);
    },
    [searchQuery, router],
  );

  useEffect(() => {
    const query = searchParams.query;
    if (query) {
      const decodedQuery = decodeURIComponent(query);
      setSearchQuery(decodedQuery);
    }
  }, [searchParams.query, searchQuery]);

  return (
    <Suspense fallback={<h1>loading search bar</h1>}>
      <form
        onSubmit={(e) => handleSearch(e)}
        className="flex space-x-2 items-center justify-center w-full mb-4"
      >
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg px-4 py-2 border rounded-md"
          placeholder={placeholder}
        />
        <Button type="submit">Search</Button>
      </form>
    </Suspense>
  );
};

export default ClientSearchInput;
