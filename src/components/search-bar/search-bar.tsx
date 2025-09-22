/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/search-bar.tsx
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePrimaryColor } from "@/lib/primary-color"

interface SearchBarProps {
  placeholder?: string
  onSearch: (value: string) => void
  buttonColor?: string
}

export const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  buttonColor,
}: SearchBarProps) => {
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();

  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex items-center gap-3 w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e: any) => setQuery(e.target.value)}
        className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        type="submit"
        style={buttonColor ? { backgroundColor: buttonColor } : BACKGROUND_PRIMARY_COLOR(0.7)}
      >
        Search
      </Button>
    </form>
  )
}