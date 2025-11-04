"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@/types/product";
import { CartIcon } from "@/components/cart-icon";

const categories: { label: string; value: ProductCategory | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "전자제품", value: "electronics" },
  { label: "의류", value: "clothing" },
  { label: "도서", value: "books" },
  { label: "식품", value: "food" },
  { label: "스포츠", value: "sports" },
  { label: "뷰티", value: "beauty" },
  { label: "생활용품", value: "home" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 왼쪽: 로고 + 장바구니 */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">쇼핑몰</span>
          </Link>

          {/* 장바구니 아이콘 (왼쪽에 위치) */}
          <Suspense fallback={null}>
            <CartIcon />
          </Suspense>
        </div>

        {/* 중앙: 카테고리 메뉴 */}
        <nav className="hidden md:flex items-center gap-6">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={
                category.value === "all"
                  ? "/products"
                  : `/products?category=${category.value}`
              }
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {category.label}
            </Link>
          ))}
        </nav>

        {/* 우측 메뉴 (로그인, 프로필) */}
        <div className="flex items-center gap-4">
          {/* 로그인 버튼 / 사용자 프로필 */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default">로그인</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
