import json
import csv

def json_para_csv(arquivo_json, arquivo_csv):
    with open(arquivo_json, 'r', encoding='utf-8') as json_file:
        dados = json.load(json_file)

    with open(arquivo_csv, 'w', newline='', encoding='utf-8') as csv_file:
        escritor = csv.writer(csv_file)
        
        # Escreve o cabeçalho
        escritor.writerow(["nome", "imagem", "codigo", "medidas"])
        
        # Escreve os dados das variações
        for produto in dados:
            for variacao in produto["variacoes"]:
                escritor.writerow([produto["nome"], produto["imagem"], variacao["codigo"], variacao["medidas"]])


    print(f'Arquivo CSV "{arquivo_csv}" gerado com sucesso!')

json_para_csv('C:/Users/dario/sge/teste-json/data.json', 'C:/Users/dario/sge/teste-json/new-dados.csv')
