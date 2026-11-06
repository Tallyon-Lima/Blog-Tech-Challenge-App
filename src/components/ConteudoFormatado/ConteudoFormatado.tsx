import { Cores } from "@/constants/colors";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

// Converte **negrito** e *itálico* em trechos de texto estilizados
function renderTrechos(texto: string): ReactNode[] {
    const partes: ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let ultimo = 0;
    let chave = 0;
    let achado: RegExpExecArray | null;

    while ((achado = regex.exec(texto)) !== null) {
        if (achado.index > ultimo) {
            partes.push(texto.slice(ultimo, achado.index));
        }

        const token = achado[0];

        if (token.startsWith("**")) {
            partes.push(<Text key={chave++} style={styles.negrito}>{token.slice(2, -2)}</Text>);
        } else {
            partes.push(<Text key={chave++} style={styles.italico}>{token.slice(1, -1)}</Text>);
        }

        ultimo = regex.lastIndex;
    }

    if (ultimo < texto.length) {
        partes.push(texto.slice(ultimo));
    }

    return partes.length > 0 ? partes : [texto];
}

// Renderiza o conteúdo do post com o mesmo markdown simples do web:
// títulos (#, ##, ###), listas (* ou -), separadores (--- ou ***), negrito e itálico.
export default function ConteudoFormatado({ conteudo }: { conteudo: string }) {
    const elementos: ReactNode[] = [];
    let lista: string[] = [];

    const fecharLista = () => {
        if (lista.length === 0) return;

        const itens = lista;
        lista = [];

        elementos.push(
            <View key={`ul-${elementos.length}`} style={styles.lista}>
                {itens.map((item, indice) => (
                    <View key={indice} style={styles.itemLista}>
                        <Text style={styles.marcador}>{"•"}</Text>
                        <Text style={[styles.paragrafo, styles.textoItem]}>{renderTrechos(item)}</Text>
                    </View>
                ))}
            </View>
        );
    };

    conteudo.split(/\r?\n/).forEach((bruta, indice) => {
        const linha = bruta.trim();

        if (linha.startsWith("* ") || linha.startsWith("- ")) {
            lista.push(linha.slice(2));
            return;
        }

        fecharLista();

        if (!linha) return;

        if (linha.startsWith("### ")) {
            elementos.push(<Text key={indice} style={styles.titulo3}>{linha.slice(4)}</Text>);
        } else if (linha.startsWith("## ")) {
            elementos.push(<Text key={indice} style={styles.titulo2}>{linha.slice(3)}</Text>);
        } else if (linha.startsWith("# ")) {
            elementos.push(<Text key={indice} style={styles.titulo1}>{linha.slice(2)}</Text>);
        } else if (linha === "---" || linha === "***") {
            elementos.push(<View key={indice} style={styles.separador} />);
        } else {
            elementos.push(<Text key={indice} style={styles.paragrafo}>{renderTrechos(linha)}</Text>);
        }
    });

    fecharLista();

    return <View>{elementos}</View>;
}

const styles = StyleSheet.create({
    paragrafo: {
        fontSize: 16,
        lineHeight: 25,
        color: "#334155",
        marginBottom: 12,
    },
    negrito: {
        fontWeight: "700",
        color: Cores.texto,
    },
    italico: {
        fontStyle: "italic",
    },
    titulo1: {
        fontSize: 24,
        fontWeight: "800",
        color: Cores.texto,
        marginTop: 8,
        marginBottom: 12,
    },
    titulo2: {
        fontSize: 21,
        fontWeight: "700",
        color: Cores.texto,
        marginTop: 8,
        marginBottom: 10,
        paddingBottom: 6,
        borderBottomWidth: 2,
        borderBottomColor: "#f1f5f9",
    },
    titulo3: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1e293b",
        marginTop: 6,
        marginBottom: 8,
    },
    separador: {
        borderTopWidth: 1,
        borderTopColor: "#cbd5e1",
        borderStyle: "dashed",
        marginVertical: 14,
    },
    lista: {
        marginBottom: 6,
    },
    itemLista: {
        flexDirection: "row",
        gap: 8,
        paddingLeft: 6,
    },
    marcador: {
        fontSize: 16,
        lineHeight: 25,
        color: "#334155",
    },
    textoItem: {
        flex: 1,
        marginBottom: 6,
    },
});
