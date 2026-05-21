import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.5-flash';
const ALLOWED_TONES = new Set(['cyan', 'emerald', 'amber']);

function extractJsonPayload(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error('A Gemini API retornou uma resposta vazia.');
  }

  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/```\s*([\s\S]*?)```/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

function normalizeMetric(metric, index) {
  const fallbackLabels = ['Oleosidade', 'Densidade', 'Saude do couro cabeludo'];
  const fallbackTones = ['amber', 'emerald', 'cyan'];
  const numericScore = Number(metric?.score);

  return {
    label: typeof metric?.label === 'string' && metric.label.trim() ? metric.label.trim() : fallbackLabels[index] || `Metrica ${index + 1}`,
    value: typeof metric?.value === 'string' && metric.value.trim() ? metric.value.trim() : 'Sem leitura',
    score: Number.isFinite(numericScore) ? Math.min(100, Math.max(0, Math.round(numericScore))) : 0,
    tone: ALLOWED_TONES.has(metric?.tone) ? metric.tone : fallbackTones[index % fallbackTones.length],
  };
}

function normalizeResult(payload) {
  const carePlan = Array.isArray(payload?.carePlan) ? payload.carePlan.filter((item) => typeof item === 'string' && item.trim()) : [];
  const metrics = Array.isArray(payload?.metrics) ? payload.metrics.map(normalizeMetric).slice(0, 3) : [];

  return {
    imageCheck:
      typeof payload?.imageCheck === 'string' && payload.imageCheck.trim()
        ? payload.imageCheck.trim()
        : 'A imagem foi recebida, mas o modelo nao devolveu uma verificacao detalhada.',
    summary:
      typeof payload?.summary === 'string' && payload.summary.trim()
        ? payload.summary.trim()
        : 'A Gemini nao retornou um resumo suficiente para a imagem enviada.',
    recommendation:
      typeof payload?.recommendation === 'string' && payload.recommendation.trim()
        ? payload.recommendation.trim()
        : 'Recomendacao indisponivel',
    carePlan: carePlan.length ? carePlan.slice(0, 4) : ['Sem plano retornado pela Gemini para esta imagem.'],
    metrics: metrics.length ? metrics : [
      { label: 'Oleosidade', value: 'Sem leitura', score: 0, tone: 'amber' },
      { label: 'Densidade', value: 'Sem leitura', score: 0, tone: 'emerald' },
      { label: 'Saude do couro cabeludo', value: 'Sem leitura', score: 0, tone: 'cyan' },
    ],
  };
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Metodo nao permitido.' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: 'A variavel GEMINI_API_KEY nao esta configurada no ambiente do Vercel.' });
    return;
  }

  const { imageBase64, mimeType = 'image/jpeg', fileName = 'imagem' } = parseBody(req.body);

  if (typeof imageBase64 !== 'string' || !imageBase64.trim()) {
    res.status(400).json({ error: 'A imagem enviada esta vazia ou invalida.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                'Voce esta analisando uma imagem para uma barbearia premium. Primeiro verifique se a imagem enviada permite uma leitura cosmetica util de cabelo, barba ou couro cabeludo masculino. Depois gere apenas JSON valido com as chaves imageCheck, summary, recommendation, carePlan e metrics. metrics deve conter exatamente 3 itens com label, value, score e tone. tone deve ser apenas cyan, emerald ou amber. A resposta deve ser estetica e cosmetica, sem diagnostico medico, sem falar de doencas e sem sugerir tratamento clinico. summary deve explicar o que a imagem mostra e se a qualidade ajuda ou atrapalha a leitura. recommendation deve sugerir o melhor direcionamento estetico ou corte. carePlan deve trazer 3 a 4 acoes objetivas para a barbearia ou home care. O nome do arquivo enviado foi: ' + fileName,
            },
            {
              inlineData: {
                data: imageBase64,
                mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const rawText = typeof response.text === 'string' ? response.text : '';
    const parsed = JSON.parse(extractJsonPayload(rawText));
    res.status(200).json(normalizeResult(parsed));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha desconhecida ao consultar a Gemini API.';
    res.status(500).json({ error: message });
  }
}