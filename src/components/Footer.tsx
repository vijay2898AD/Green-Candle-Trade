// src/components/Footer.tsx

export const Footer = () => {
  // Get the current year automatically
  const currentYear = new Date().getFullYear(); 

  return (
    // Added 'flex flex-col' and 'items-center' to stack the lines
    <footer className="w-full text-center p-6 mt-8 text-gray-400 text-sm flex flex-col items-center gap-2">
      {/* 1. Copyright Line */}
      <span>
        © {currentYear} Green Candle Trade. All rights reserved.
      </span>
      
      {/* 2. "Made with" Line */}
      <span>
        Made with <span className="text-red-500">❤️</span> by Vijay
      </span>
    </footer>
  );
};