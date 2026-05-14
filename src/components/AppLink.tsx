"use client";

import { forwardRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function normalizeTo(to: string | undefined | null): string {
  if (typeof to === "string") return to;
  return "#";
}

type NextLinkProps = Omit<React.ComponentPropsWithoutRef<typeof NextLink>, "href">;

interface LinkProps extends NextLinkProps {
  to?: string;
  href?: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function AppLink(
  { to, href, children, ...props },
  ref,
) {
  const resolvedHref = normalizeTo(href ?? to);
  if (resolvedHref === "#" || isExternalHref(resolvedHref)) {
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

function isActivePath(pathname: string, href: string, end: boolean): boolean {
  if (!href || href === "#") return false;
  if (href === "/") return pathname === "/";
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavLinkProps extends Omit<LinkProps, "className" | "style"> {
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  style?: React.CSSProperties | ((props: { isActive: boolean }) => React.CSSProperties);
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function AppNavLink(
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

    if (resolvedHref === "#" || isExternalHref(resolvedHref)) {
      return (
        <a
          ref={ref}
          href={resolvedHref}
          className={computedClassName}
          style={computedStyle}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <NextLink
        ref={ref}
        href={resolvedHref}
        className={computedClassName}
        style={computedStyle}
        {...props}
      >
        {children}
      </NextLink>
    );
  },
);

export function useLocation() {
  const pathname = usePathname() || "/";
  return { pathname };
}
