"use client";

import React, { forwardRef, useMemo } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";

function normalizeTo(to) {
  if (typeof to === "string") return to;
  if (to == null) return "#";
  return String(to);
}

function isExternalHref(href) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function isActivePath(pathname, href, end) {
  if (!href || href === "#") return false;
  if (href === "/") return pathname === "/";
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const Link = forwardRef(function RouterCompatLink(
  { to, href, children, ...props },
  ref,
) {
  const resolvedHref = normalizeTo(href ?? to);

  // Keep anchors/modal toggles working for hash links and external URLs.
  if (resolvedHref.startsWith("#") || isExternalHref(resolvedHref)) {
    return (
      <a ref={ref} href={resolvedHref} {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink ref={ref} href={resolvedHref} {...props}>
      {children}
    </NextLink>
  );
});

export const NavLink = forwardRef(function RouterCompatNavLink(
  { to, href, className, style, end = false, children, ...props },
  ref,
) {
  const pathname = usePathname() || "/";
  const resolvedHref = normalizeTo(href ?? to);
  const isActive = isActivePath(pathname, resolvedHref, end);

  const computedClassName =
    typeof className === "function" ? className({ isActive }) : className;
  const computedStyle =
    typeof style === "function" ? style({ isActive }) : style;

  return (
    <Link
      ref={ref}
      href={resolvedHref}
      className={computedClassName}
      style={computedStyle}
      {...props}
    >
      {children}
    </Link>
  );
});

export function useLocation() {
  const pathname = usePathname() || "/";

  return useMemo(
    () => ({
      pathname,
    }),
    [pathname],
  );
}

export function useNavigate() {
  const router = useRouter();

  return (to, options = {}) => {
    const nextPath = normalizeTo(to);

    if (options?.replace) {
      router.replace(nextPath);
      return;
    }

    router.push(nextPath);
  };
}
