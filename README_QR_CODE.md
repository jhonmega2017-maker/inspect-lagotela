# Sistema de Leitura de QR Code - CIGAM

## 📱 Características

- ✅ Leitura de QR Code direto da câmera do celular/dispositivo
- ✅ Preenchimento automático da OP e informações da CIGAM
- ✅ Interface intuitiva com guia de posicionamento
- ✅ Detecção visual em tempo real
- ✅ Suporte para múltiplos formatos de dados

## 🚀 Como Usar

### 1. Abrir o Leitor de QR Code
- Na aba **"Identificação"**, clique no botão **"Ler QR Code da Câmera"**
- O aplicativo vai solicitar permissão para acessar a câmera

### 2. Posicionar o QR Code
- Aponte a câmera para o QR Code
- Posicione dentro do **quadro vermelho** da interface
- Aguarde a detecção automática (cerca de 1-2 segundos)

### 3. Confirmação
- Quando o QR Code for lido, os dados serão **automaticamente preenchidos**:
  - **Número da OP** - do campo de OP da CIGAM
  - **Obra/Cliente** - informações do cliente
- A interface mostrará os dados extraídos
- O modal fechará automaticamente após 2 segundos

## 📊 Formatos Suportados

### Formato 1: URL com Parâmetros (CIGAM)
```
https://www.cigam.com.br/op?op=OP-2025-001&cliente=Condomínio Solar Azul
```
**Parâmetros reconhecidos:**
- `op` ou `OP` - Número da Ordem de Produção
- `cliente` ou `obra` ou `nome` - Nome do cliente/obra

### Formato 2: JSON Estruturado
```json
{
  "op": "OP-2025-001",
  "obra": "Condomínio Solar Azul",
  "cliente": "João Silva"
}
```

### Formato 3: Número de OP Simples
```
OP-2025-001
```
Se o QR Code contiver apenas um número/texto, será interpretado como número da OP.

## ⚙️ Configuração Técnica

### Permissões Necessárias
- **Câmera** - Obrigatória para ler QR Codes
- A primeira vez, o navegador solicitará permissão
- Aceite para permitir o acesso

### Navegadores Suportados
- ✅ Chrome/Chromium (Desktop e Mobile)
- ✅ Firefox (Desktop e Mobile)
- ✅ Safari (iOS 14.5+)
- ✅ Edge
- ✅ Qualquer navegador com suporte a getUserMedia API

### Bibliotecas Utilizadas
- **jsQR** (v1.4.0) - Decodificação de QR Codes
- Carregada via CDN: `cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js`

## 🔧 Configurar QR Codes na CIGAM

1. **Gere um QR Code contendo:**
   - Número da OP
   - Nome do cliente/obra
   - URL de referência (opcional)

2. **Formatos recomendados:**
   - URL com parâmetros GET (mais completo)
   - JSON estruturado (mais flexível)
   - Número de OP simples (mínimo)

3. **Implemente na CIGAM:**
   - Gere QR Code na emissão de cada OP
   - Disponibilize para impressão ou envio digital
   - Use biblioteca como `qrcode.js` ou similar

## 📝 Exemplo de Geração (CIGAM Backend)

```javascript
// Gera URL com parâmetros
const op = "OP-2025-001";
const cliente = "Condomínio Solar Azul";
const qrUrl = `https://www.cigam.com.br/op?op=${encodeURIComponent(op)}&cliente=${encodeURIComponent(cliente)}`;

// Gera QR Code usando biblioteca qrcode.js
QRCode.toDataURL(qrUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.95,
    margin: 1,
    width: 300,
    color: {
        dark: "#C41E3A",
        light: "#ffffff"
    }
}, (err, url) => {
    if (err) console.error(err);
    console.log("QR Code gerado:", url);
});
```

## 🐛 Troubleshooting

### "Permissão de câmera negada"
- Verifique as configurações de privacidade do seu dispositivo
- Conceda permissão ao navegador para acessar câmera
- Feche e reabra o aplicativo

### "QR Code não detecta"
- Certifique-se de que a câmera está focada
- Melhore a iluminação
- Aproxime ou afaste o QR Code conforme necessário
- Verifique se o QR Code está íntegro e legível

### "Dados não preenchidos"
- Verifique se o QR Code contém os parâmetros corretos
- Abra o console do navegador (F12) para ver mensagens de debug
- Certifique-se de usar um dos formatos suportados

### "Câmera não aparece no iOS"
- Certifique-se de estar usando iOS 14.5 ou superior
- Conceda permissão na primeira tentativa
- Use Safari ou navegadores baseados em WebKit

## 💾 Dados Salvos

Quando o QR Code é lido e os dados são preenchidos:
- ✅ Número da OP é salvo automaticamente
- ✅ Obra/Cliente é salvo automaticamente
- ✅ Todos os dados são salvos no localStorage
- ✅ Os dados persistem mesmo depois de fechar a aba

## 🎯 Próximas Funcionalidades Sugeridas

- Integração com API CIGAM para buscar dados completos
- Validação de OP em tempo real
- Histórico de QR Codes lidos
- Sincronização automática com CIGAM
- Exportação de relatórios integrados

---

**Desenvolvido para: Lagotela - Cercamento Inteligente**  
**Data: 28/11/2025**
