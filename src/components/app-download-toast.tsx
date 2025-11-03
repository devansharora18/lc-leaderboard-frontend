"use client"

import { useEffect } from "react"
import { toast } from "sonner"

const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.dscvit.leeterboard&pcampaignid=web_share"
const STORAGE_KEY = "app_download_toast_dismissed"

export function AppDownloadToast() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Detect mobile viewport
    const isMobile =
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(max-width: 768px)").matches) ||
      window.innerWidth <= 768

    // On desktop/tablet, only show if not dismissed before
    if (!isMobile) {
      const dismissed = window.localStorage.getItem(STORAGE_KEY) === "true"
      if (dismissed) return
    }

    const id = toast(
      "Download the app on Play Store",
      {
        description:
          "Get the Leeterboard Android app for a better experience.",
        action: {
          label: "Open",
          onClick: () => {
            window.open(PLAYSTORE_URL, "_blank", "noopener,noreferrer")
          },
        },
        cancel: {
          label: "Dismiss",
          onClick: () => {
            // Remember dismissal so we don't show it again on non-mobile
            try {
              window.localStorage.setItem(STORAGE_KEY, "true")
            } catch {}
          },
        },
        // Duration long enough to be noticed
        duration: 10000,
      }
    )

    // If the user closes it manually (e.g., timeout), don't permanently hide

    return () => {}
  }, [])

  return null
}
