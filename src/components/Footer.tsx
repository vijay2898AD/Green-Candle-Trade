export const Footer = () => {

  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="w-full text-center p-6 mt-8 text-gray-400 text-sm flex flex-col items-center gap-2">
      <span>
        © {currentYear} Green Candle Trade. All rights reserved.
      </span>
      <span>
        Made with <span className="text-red-500">❤️</span> by Vijay
      </span>
    </footer>
  );
};