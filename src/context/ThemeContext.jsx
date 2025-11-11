import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    const saved = localStorage.getItem("tema");
    return saved || "claro";
  });
  
  const [idioma, setIdioma] = useState(() => {
    const saved = localStorage.getItem("idioma");
    return saved || "es";
  });

  // Aplicar tema al documento raíz
  useEffect(() => {
    localStorage.setItem("tema", tema);
    const root = document.documentElement;
    
    if (tema === "oscuro") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [tema]);

  useEffect(() => {
    localStorage.setItem("idioma", idioma);
  }, [idioma]);

  const cambiarTema = (nuevoTema) => {
    setTema(nuevoTema);
  };

  const cambiarIdioma = (nuevoIdioma) => {
    setIdioma(nuevoIdioma);
  };

  const toggleTema = () => {
    setTema(prev => prev === "claro" ? "oscuro" : "claro");
  };

  return (
    <ThemeContext.Provider value={{ 
      tema, 
      cambiarTema, 
      toggleTema,
      idioma, 
      cambiarIdioma 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe ser usado dentro de un ThemeProvider");
  }
  return context;
}