import csv
import json
from collections import defaultdict

def csv_para_json(arquivo_csv, arquivo_json):
    dados = defaultdict(lambda: {
        "imagem": "",
        "imagem2": "",  # Adicionei este campo
        "categoria": "",
        "variacoes": []
    })

    with open(arquivo_csv, 'r', encoding='utf-8') as csv_file:
        leitor = csv.DictReader(csv_file)
        
        for linha in leitor:
            nome = linha["nome"]
            if not dados[nome]["imagem"]:
                dados[nome]["imagem"] = linha["imagem"]
                dados[nome]["imagem2"] = linha.get("imagem2", linha["imagem"])  # Usa imagem1 como fallback
                dados[nome]["categoria"] = linha["categoria"]
            
            dados[nome]["variacoes"].append({
                "codigo": linha["codigo"],
                "medidas": linha["medidas"]
            })

    resultado = [{
        "nome": nome, 
        "imagem": produto["imagem"],
        "imagem2": produto["imagem2"],  # Incluído no resultado
        "categoria": produto["categoria"],
        "variacoes": produto["variacoes"]
    } for nome, produto in dados.items()]

    with open(arquivo_json, 'w', encoding='utf-8') as json_file:
        json.dump(resultado, json_file, indent=4, ensure_ascii=False)

    print(f'Arquivo JSON "{arquivo_json}" gerado com sucesso!')

csv_para_json('dados-produtos.csv', 'dados-produtos-convertido.json')