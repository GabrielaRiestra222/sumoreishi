import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phone = "34627202452";
  const message = encodeURIComponent("Hola, quiero consultar sobre Sumo Reishi.");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed right-5 bottom-36 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition md:right-6 md:bottom-28"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = "#18181b";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = "#000000";
      }}
    >
      <MessageCircle size={22} strokeWidth={1.8} />
    </a>
  );
}
