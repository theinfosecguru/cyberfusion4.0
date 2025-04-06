//use-mobile
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

'use client'

import { useState, useEffect } from 'react'

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (browser environment)
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      
      // Initial check
      checkIfMobile()
      
      // Add event listener for window resize
      window.addEventListener('resize', checkIfMobile)
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', checkIfMobile)
      }
    }
  }, [])

  return isMobile
}
