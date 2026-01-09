import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react"

type Mode = "none" | "folder" | "file" | "link"

export function AddItemDropdown() {
  const [mode, setMode] = useState<Mode>("none")
  const folderRef = useRef<HTMLInputElement>(null)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button>＋ Add</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {mode === "none" && (
          <>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setMode("folder")
                requestAnimationFrame(() => folderRef.current?.focus())
              }}
            >
              Add folder
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setMode("file")
              }}
            >
              Upload file
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setMode("link")
              }}
            >
              Add link
            </DropdownMenuItem>
          </>
        )}

        {mode === "folder" && (
          <div className="space-y-3 px-2 py-2">
            <Label>Folder name</Label>
            <Input ref={folderRef} placeholder="New folder" />

            <Actions onCancel={() => setMode("none")} />
          </div>
        )}

        {mode === "file" && (
          <div className="space-y-3 px-2 py-2">
            <Label>Upload file</Label>
            <Input type="file" />

            <Actions onCancel={() => setMode("none")} />
          </div>
        )}

        {mode === "link" && (
          <div className="space-y-3 px-2 py-2">
            <Label>Link URL</Label>
            <Input placeholder="https://example.com" />

            <Actions onCancel={() => setMode("none")} />
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Actions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Back
      </Button>
      <Button size="sm">Add</Button>
    </div>
  )
}

