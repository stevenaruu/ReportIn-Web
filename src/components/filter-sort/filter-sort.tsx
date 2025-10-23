import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, Filter } from "lucide-react"
import { hexToRgba } from "@/lib/hex-to-rgba"
import { Checkbox } from "../ui/checkbox"
import { usePrimaryColor } from "@/lib/primary-color"
import { useSelector } from "react-redux"
import { selectCampus } from "@/store/campus/selector"

type SortBy = "status" | "area" | "category" | "count"
type SortDirection = "asc" | "desc"
type Status = "PENDING" | "IN PROGRESS" | "DONE"

interface FilterSortProps {
  areas: string[]
  categories: string[]
  initialStatus?: Status[]
  initialAreas?: string[]
  initialCategories?: string[]
  onApply: (filters: {
    sortBy: SortBy
    sortDirection: SortDirection
    status: Status[]
    areas: string[]
    categories: string[]
  }) => void
}

// helper hook untuk cek screen size
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) setMatches(media.matches)
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])
  return matches
}

export default function FilterSort({
  areas,
  categories,
  initialStatus = [],
  initialAreas = [],
  initialCategories = [],
  onApply,
}: FilterSortProps) {
  const campus = useSelector(selectCampus)
  const { BACKGROUND_PRIMARY_COLOR, TEXT_PRIMARY_COLOR } = usePrimaryColor()

  const [open, setOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>("count")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedStatus, setSelectedStatus] = useState<Status[]>(initialStatus)
  const [selectedAreas, setSelectedAreas] = useState<string[]>(initialAreas)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories)

  useEffect(() => {
    if (JSON.stringify(selectedCategories) !== JSON.stringify(initialCategories)) {
      setSelectedCategories(initialCategories)
    }
  }, [initialCategories])

  useEffect(() => {
    if (JSON.stringify(selectedAreas) !== JSON.stringify(initialAreas)) {
      setSelectedAreas(initialAreas)
    }
  }, [initialAreas])

  useEffect(() => {
    if (JSON.stringify(selectedStatus) !== JSON.stringify(initialStatus)) {
      setSelectedStatus(initialStatus)
    }
  }, [initialStatus])

  const isMobile = useMediaQuery("(max-width: 768px)")

  const toggleArrayValue = <T,>(arr: T[], value: T, setter: (val: T[]) => void) => {
    if (arr.includes(value)) {
      setter(arr.filter((v) => v !== value))
    } else {
      setter([...arr, value])
    }
  }

  const applyFilters = () => {
    onApply({
      sortBy,
      sortDirection,
      status: selectedStatus,
      areas: selectedAreas,
      categories: selectedCategories,
    })
  }

  const handleApply = () => {
    applyFilters()
    setOpen(false)
  }

  const filterContent = (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {/* Status */}
      <div>
        <h4 className="font-medium mb-2">Status</h4>
        <div className="grid grid-cols-2 gap-2">
          {["PENDING", "IN PROGRESS", "DONE"].map((s) => (
            <label key={s} className="flex items-center gap-2">
              <Checkbox
                style={{
                  backgroundColor: selectedStatus.includes(s as Status)
                    ? hexToRgba(campus?.customization.primaryColor, 0.7)
                    : undefined,
                }}
                checked={selectedStatus.includes(s as Status)}
                onCheckedChange={() => toggleArrayValue(selectedStatus, s as Status, setSelectedStatus)}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <h4 className="font-medium mb-2">Area</h4>
        <div className="grid grid-cols-2 gap-2">
          {areas.map((a) => (
            <label key={a} className="flex items-center gap-2">
              <Checkbox
                style={{
                  backgroundColor: selectedAreas.includes(a)
                    ? hexToRgba(campus?.customization.primaryColor, 0.7)
                    : undefined,
                }}
                checked={selectedAreas.includes(a)}
                onCheckedChange={() => toggleArrayValue(selectedAreas, a, setSelectedAreas)}
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="font-medium mb-2">Category</h4>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <Checkbox
                style={{
                  backgroundColor: selectedCategories.includes(c)
                    ? hexToRgba(campus?.customization.primaryColor, 0.7)
                    : undefined,
                }}
                checked={selectedCategories.includes(c)}
                onCheckedChange={() => toggleArrayValue(selectedCategories, c, setSelectedCategories)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="md:hidden">
        <h4 className="font-medium mb-2">Sort By</h4>
        <div className="flex flex-col gap-1">
          {["count", "status", "area", "category"].map((val) => (
            <label
              key={val}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setSortBy(val as SortBy)}
            >
              <input
                style={{ accentColor: hexToRgba(campus?.customization.primaryColor, 0.7) }}
                type="radio"
                checked={sortBy === val}
                onChange={() => setSortBy(val as SortBy)}
              />
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Sort Direction */}
      <div className="md:hidden">
        <h4 className="font-medium mb-2">Sort Direction</h4>
        <div className="flex flex-col gap-1">
          {["asc", "desc"].map((val) => (
            <label
              key={val}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setSortDirection(val as SortDirection)}
            >
              <input
                type="radio"
                style={{ accentColor: hexToRgba(campus?.customization.primaryColor, 0.7) }}
                checked={sortDirection === val}
                onChange={() => setSortDirection(val as SortDirection)}
              />
              {val === "asc" ? "Ascending" : "Descending"}
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex items-center gap-2">
      {isMobile ? (
        // MOBILE -> semua filter & sort masuk modal
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              style={BACKGROUND_PRIMARY_COLOR(0.7)}
              variant="outline"
              className="flex items-center rounded-full gap-2 text-white bg-transparent"
            >
              <Filter className="w-4 h-4" /> Filter & Sort
            </Button>
          </DialogTrigger>
          <DialogContent className="text-[#5d5d5d] max-w-sm">
            <DialogHeader>
              <DialogTitle>Filter & Sort</DialogTitle>
            </DialogHeader>
            {filterContent}
            <div className="flex justify-end mt-4">
              <Button className="px-10" style={BACKGROUND_PRIMARY_COLOR(0.7)} onClick={handleApply}>
                Apply
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        // DESKTOP -> tampil seperti biasa
        <>
          {/* Filter */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                style={BACKGROUND_PRIMARY_COLOR(0.7)}
                variant="outline"
                className="flex items-center bg-transparent"
              >
                <Filter className="w-4 h-4 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="text-[#5d5d5d] max-w-lg">
              <DialogHeader>
                <DialogTitle>Filter</DialogTitle>
              </DialogHeader>
              {filterContent}
              <div className="flex justify-end mt-4">
                <Button className="px-10" style={BACKGROUND_PRIMARY_COLOR(0.7)} onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Sort By */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                style={BACKGROUND_PRIMARY_COLOR(0.7)}
                variant="default"
                className="text-white flex items-center gap-2"
              >
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel style={TEXT_PRIMARY_COLOR(0.7)}>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                style={TEXT_PRIMARY_COLOR(0.7)}
                value={sortBy}
                onValueChange={(val: string) => setSortBy(val as SortBy)}
              >
                <DropdownMenuRadioItem value="count">Count</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="area">Area</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="category">Category</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Direction */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button style={BACKGROUND_PRIMARY_COLOR(0.7)} variant="default" className="flex items-center gap-2">
                {sortDirection === "asc" ? "Ascending" : "Descending"} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                style={TEXT_PRIMARY_COLOR(0.7)}
                value={sortDirection}
                onValueChange={(val: string) => setSortDirection(val as SortDirection)}
              >
                <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}