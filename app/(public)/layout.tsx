import Header from "@/src/shared/components/ui/Header";
import Footer from "@/src/shared/components/ui/Footer";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
