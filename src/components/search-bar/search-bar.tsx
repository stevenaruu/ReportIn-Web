import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePrimaryColor } from "@/lib/primary-color"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"

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
  const campus = useSelector(selectCampus);
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const getButtonColor = () => {
    if (buttonColor) return { backgroundColor: buttonColor };
    return campus ? BACKGROUND_PRIMARY_COLOR(0.7) : BACKGROUND_PRIMARY_COLOR(1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex items-center gap-3 w-full"
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button type="submit" className="px-4" style={getButtonColor()}>
        Search
      </Button>
    </form>
  );
};