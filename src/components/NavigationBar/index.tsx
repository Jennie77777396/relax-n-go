"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Moon, Sun, Search, Globe, Type, Folder, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

const fonts = ["Inter", "Roboto", "Open Sans"]
const languages = ["English", "Spanish", "French", "German"]

export default function NavigationBar() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [currentFont, setCurrentFont] = useState(fonts[0])


  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const searchTerm = (event.currentTarget.elements.namedItem("search") as HTMLInputElement).value
    // Implement search functionality here
    console.log("Searching for:", searchTerm)
  }

  const switchLanguage = (lang: string) => {
    // Implement language switching logic here
    console.log("Switching to language:", lang)
  }

  const switchFont = (font: string) => {
    setCurrentFont(font)
    document.body.style.fontFamily = font
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-background">
      <div className="flex items-center space-x-4">
        <Link href="/home" className="text-2xl font-bold">
          Jennie's Portfolio
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Folder className="h-4 w-4 mr-2" /> Fields
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => router.push("/full-stack")}>Full Stack Projects</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/algo")}>Algorithms</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/behavioral")}>Behavioral Questions</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href = "/todo" className="text-sm">
        <Button variant="ghost">
              <ListTodo className="h-4 w-4 mr-2" /> To Do List
            </Button>
        </Link>
      </div>



      <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="search" name="search" placeholder="Search..." className="pl-8 w-full" />
        </div>
      </form>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-4 w-4" />
              <span className="sr-only">Switch language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {languages.map((lang) => (
              <DropdownMenuItem key={lang} onClick={() => switchLanguage(lang)}>
                {lang}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Type className="h-4 w-4" />
              <span className="sr-only">Switch font</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {fonts.map((font) => (
              <DropdownMenuItem key={font} onClick={() => switchFont(font)}>
                {font}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

