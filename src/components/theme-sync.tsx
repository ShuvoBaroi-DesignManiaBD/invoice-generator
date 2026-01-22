"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

export function ThemeSync({ themePreference }: { themePreference?: string }) {
  const { setTheme, theme } = useTheme()
  const mounted = useRef(false)

  useEffect(() => {
    // Only sync if we have a valid preference from the DB
    if (themePreference && themePreference !== "system" && mounted.current === false) {
      if (theme !== themePreference) {
        setTheme(themePreference)
      }
      mounted.current = true
    }
  }, [themePreference, setTheme, theme])

  return null
}
