# Exemplos de QR Codes para Teste

## 📌 QR Codes de Teste

Você pode usar qualquer gerador de QR Code para criar testes. Aqui estão os formatos recomendados:

### ✅ Formato 1: URL com Parâmetros (CIGAM)
```
https://www.cigam.com.br/op?op=OP-2025-001&cliente=Condomínio Solar Azul
```

**O que preenche:**
- Campo "Número da OP" → OP-2025-001
- Campo "Obra / Cliente" → Condomínio Solar Azul

---

### ✅ Formato 2: JSON Estruturado
```
{"op":"OP-2025-002","obra":"Edifício Comercial","cliente":"ABC Construções"}
```

**O que preenche:**
- Campo "Número da OP" → OP-2025-002
- Campo "Obra / Cliente" → Edifício Comercial

---

### ✅ Formato 3: Número de OP Simples
```
OP-2025-003
```

**O que preenche:**
- Campo "Número da OP" → OP-2025-003

---

## 🔗 Geradores de QR Code Online

1. **https://www.qr-code-generator.com/**
   - Grátis
   - Suporta URL e texto
   - Permite customizar cores

2. **https://www.qrcode-monkey.com/**
   - Design personalizado
   - Suporta logo no centro
   - Cores customizáveis

3. **https://www.qr-code.express/**
   - Simples e rápido
   - Geração instantânea

## 🎨 Como Gerar com Cores Lagotela

Ao gerar QR Codes, use:
- **Cor Escura:** #C41E3A (Vermelho Lagotela)
- **Cor Clara:** #FFFFFF (Branco)

Isso deixará os QR Codes com a identidade visual da empresa.

## 📱 Testando no Celular

1. Abra o aplicativo em um navegador mobile
2. Clique em "Ler QR Code da Câmera"
3. Aponte para qualquer QR Code
4. O aplicativo preencherá automaticamente os dados

## 💡 Dicas para Testes

### Teste 1: URL com Dados Completos
```
https://www.cigam.com.br/op?op=OP-TEST-001&cliente=Cliente Teste
```
- Leia com o leitor do aplicativo
- Verifique se os dados são preenchidos

### Teste 2: JSON com Múltiplos Campos
```
{"op":"OP-ABC-123","obra":"Obra Teste","cliente":"João Silva","data":"2025-11-28"}
```
- Deve preencher OP e Obra

### Teste 3: Número Simples
```
OP-SIMPLES-999
```
- Deve preencher apenas a OP

## 🚀 Próximos Passos: Integração CIGAM

Para integrar com a plataforma CIGAM:

1. **Solicite à CIGAM:**
   - Funcionalidade de geração automática de QR Code
   - Formato dos dados no QR Code
   - Endpoint para validação de OP

2. **Implemente no Backend:**
   ```javascript
   // Exemplo de geração em Node.js
   const QRCode = require('qrcode');
   
   const op = "OP-2025-001";
   const cliente = "Cliente Teste";
   const qrData = `https://www.cigam.com.br/op?op=${op}&cliente=${cliente}`;
   
   QRCode.toFile('qr-code.png', qrData, {
       color: {
           dark: '#C41E3A',
           light: '#FFFFFF'
       }
   });
   ```

3. **Configure no Aplicativo:**
   - Os QR Codes serão lidos automaticamente
   - Dados preenchidos instantaneamente
   - Fluxo de inspeção otimizado

---

**Pronto para usar! 🎉**
