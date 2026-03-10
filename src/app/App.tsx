import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import { CartDrawer } from "./components/CartDrawer";
import { CookieBanner } from "./components/CookieBanner";
import { StickyBar } from "./components/StickyBar";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { TrustBanner } from "./components/TrustBanner";

// Páginas
import { PrivacidadPage } from "./components/PrivacidadPage";
import { AvisoLegalPage } from "./components/AvisoLegalPage";
import { CookiesPage } from "./components/CookiesPage";
import { CondicionesVentaPage } from "./components/CondicionesVentaPage";
import { ConfirmacionPage } from "./components/ConfirmacionPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { BlogPage } from "./components/BlogPage";
import { BlogPostPage } from "./components/BlogPostPage";

// Secciones home
import { HeroSection } from "./components/HeroSection";
import { ProductInfo } from "./components/ProductInfo";
import { IngredientSection2 } from "./components/IngredientSection2";
import { ProductSection2 } from "./components/ProductSection2";
import { HowToUseSection2 } from "./components/HowToUseSection2";
import { ValueDarkSection2 } from "./components/ValueDarkSection2";
import { OrigenSection } from "./components/OrigenSection";
import ReviewsSection from "./components/ReviewsSection";
import { reviews } from "./data/review.mocks";
import { BenefitsScienceSection2 } from "./components/BenefitsScienceSection2";
import { FAQSection2 } from "./components/FAQSection2";
import { PurchaseSection2 } from "./components/PurchaseSection2";
import { ContactSection } from "./components/ContactSection";

function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section id="hero"><HeroSection /></section>
        <TrustBanner />
        <section id="ingredient"><IngredientSection2 /></section>
        <section id="productinfo"><ProductInfo /></section>
        <section id="product"><ProductSection2 /></section>
        <section id="how-to-use"><HowToUseSection2 /></section>
        <section id="value-dark"><ValueDarkSection2 /></section>
        <section id="origen"><OrigenSection /></section>
        <section id="reviews"><ReviewsSection reviews={reviews} /></section>
        <section id="benefitsscience"><BenefitsScienceSection2 /></section>
        <section id="contacto"><ContactSection /></section>
        <section id="faq"><FAQSection2 /></section>
        <section id="purchase" className="scroll-mt-[80px]"><PurchaseSection2 /></section>
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-[#F5F5F3] text-[#0e0e0e]">
          <CartDrawer />
          <CookieBanner />

          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Blog */}
            <Route path="/blog" element={<LegalLayout><BlogPage /></LegalLayout>} />
            <Route path="/blog/:slug" element={<LegalLayout><BlogPostPage /></LegalLayout>} />

            {/* Legal */}
            <Route path="/privacidad" element={<LegalLayout><PrivacidadPage /></LegalLayout>} />
            <Route path="/aviso-legal" element={<LegalLayout><AvisoLegalPage /></LegalLayout>} />
            <Route path="/cookies" element={<LegalLayout><CookiesPage /></LegalLayout>} />
            <Route path="/condiciones-venta" element={<LegalLayout><CondicionesVentaPage /></LegalLayout>} />

            {/* Post-pago */}
            <Route path="/confirmacion" element={<ConfirmacionPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}