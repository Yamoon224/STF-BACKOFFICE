import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Le back-office envoie des images (couverture CmsPage/Partenaire/Bourse,
      // et jusqu'à 10 photos par lot pour une galerie) au travers de Server
      // Actions. Le backend Laravel accepte jusqu'à 4 Mo par image ; la limite
      // par défaut de Next.js (1 Mo) rejetait ces envois dès qu'une vraie photo
      // (et non un petit fichier de test) était utilisée.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
