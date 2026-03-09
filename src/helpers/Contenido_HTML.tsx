// componentes/ContenidoHtml.tsx
import React from "react";
import { Text, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

const es_HTML = (texto: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(texto);
};

interface Props {
  contenido: string;
  estiloTexto?: object;
}

const Contenido_HTML = ({ contenido, estiloTexto }: Props) => {
  const { width } = useWindowDimensions();

  if (!contenido) return null;

  if (es_HTML(contenido)) {
    return (
      <RenderHtml
        contentWidth={width}
        source={{ html: contenido }}
        tagsStyles={{
          div: { margin: 0, padding: 0 },
          ul: { marginTop: 4 },
          li: { fontSize: 14, color: "#444" },
          b: { fontWeight: "bold" },
        }}
      />
    );
  }

  return <Text style={estiloTexto}>{contenido}</Text>;
};

export default Contenido_HTML;