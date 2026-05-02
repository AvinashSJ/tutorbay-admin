'use client'

import { useEffect } from 'react';
import { useLocation } from '@/components/router-compat';
const RouteScrollToTop = () => {
  const pathname = useLocation()

  useEffect(() => {

    window.scrollTo(0, 0);


  }, [pathname]);

  return null;
};

export default RouteScrollToTop;

