'use client'
import { HomeCtx } from '../HomeProvider'
import { useContext } from 'react'

export const useHome = () => useContext(HomeCtx)
