import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">쇼핑몰</h3>
            <p className="text-sm text-muted-foreground">
              최고의 쇼핑 경험을 제공합니다.
            </p>
          </div>

          {/* 고객센터 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">고객센터</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 쇼핑 안내 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">쇼핑 안내</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  배송 안내
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">
                  반품/교환 정책
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">
                  결제 방법
                </Link>
              </li>
            </ul>
          </div>

          {/* 마이페이지 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">마이페이지</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/my" className="hover:text-primary">
                  주문 내역
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary">
                  장바구니
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 쇼핑몰. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

