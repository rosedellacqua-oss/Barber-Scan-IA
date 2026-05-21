import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { Camera, Clock3, Scissors, Sparkles, Upload, UserRound } from 'lucide-react';

type DiagnosticMetric = {
  label: string;
  value: string;
  score: number;
  tone: 'cyan' | 'emerald' | 'amber';
};

const defaultMetrics: DiagnosticMetric[] = [
  { label: 'Oleosidade', value: 'Aguardando leitura', score: 0, tone: 'cyan' },
  { label: 'Densidade', value: 'Sem diagnostico', score: 0, tone: 'emerald' },
  { label: 'Saude do couro cabeludo', value: 'Sem diagnostico', score: 0, tone: 'amber' },
];

const analyzedMetrics: DiagnosticMetric[] = [
  { label: 'Oleosidade', value: 'Moderada', score: 68, tone: 'cyan' },
  { label: 'Densidade', value: 'Boa cobertura', score: 81, tone: 'emerald' },
  { label: 'Saude do couro cabeludo', value: 'Leve ressecamento frontal', score: 59, tone: 'amber' },
];

const carePlan = [
  'Higienizacao com shampoo de equilibrio 3x por semana.',
  'Finalizacao matte para manter volume sem pesar a raiz.',
  'Retorno em 21 dias para comparar evolucao do couro cabeludo.',
];

const upcomingClients = [
  { name: 'Mateus Silva', service: 'Corte + barba', time: '15:30' },
  { name: 'Joao Pedro', service: 'Camuflagem grisalha', time: '16:20' },
  { name: 'Rafael Costa', service: 'Corte social', time: '17:10' },
];

const journeySteps = [
  {
    title: 'Triagem cadastral',
    description: 'Identifique habitos de lavagem e uso de ativos diarios do cliente.',
  },
  {
    title: 'Modo rapido ou completo',
    description: 'Adapte o fluxo de atendimento a agenda do barbeiro.',
  },
  {
    title: 'Relatorio estetico',
    description: 'Receba protocolos de barbearia prontos e cronograma home-care.',
  },
];

function toneClasses(tone: DiagnosticMetric['tone']) {
  if (tone === 'emerald') {
    return 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20';
  }

  if (tone === 'amber') {
    return 'bg-amber-400/10 text-amber-200 border-amber-400/20';
  }

  return 'bg-cyan-400/10 text-cyan-200 border-cyan-400/20';
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [workspaceVisible, setWorkspaceVisible] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setAnalysisReady(false);
    setIsAnalyzing(false);
    setWorkspaceVisible(true);
  }

  function handleAnalysis() {
    if (!selectedFile) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisReady(false);

    window.setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisReady(true);
    }, 1800);
  }

  const metrics = analysisReady ? analyzedMetrics : defaultMetrics;

  return (
    <main className="min-h-screen overflow-hidden bg-[#080503] text-[#f6ead5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(210,168,86,0.12),_transparent_30%),linear-gradient(180deg,_rgba(8,5,3,0.92),_rgba(8,5,3,1))]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border border-[#7d6231]/50 bg-black/35 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#b08a49] text-sm font-semibold text-[#d7b26c]">
              B
            </div>
            <div>
              <p className="font-serif text-lg tracking-[0.16em] text-[#e0bb74] sm:text-xl">BARBER SCAN IA</p>
              <p className="text-[9px] uppercase tracking-[0.24em] text-[#8f6e38] sm:text-[10px]">Cosmetic analysis & aesthetics</p>
            </div>
          </div>
          <div className="rounded-full border border-[#7d6231] px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#d6ae62]">
            Sistema credenciado
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center py-16 text-center sm:py-24 lg:py-28">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b58d46] text-[#d8b166] shadow-[0_0_0_1px_rgba(181,141,70,0.12)]">
            <Scissors className="h-7 w-7" />
          </div>

          <h1 className="mt-8 font-serif text-5xl leading-none tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">BARBER </span>
            <span className="text-[#c89a45]">SCAN IA</span>
          </h1>

          <div className="mt-5 flex items-center gap-3 text-[#c89a45]">
            <div className="h-px w-12 bg-[#8f6d35]" />
            <div className="h-2.5 w-2.5 rotate-45 border border-[#b78d45] bg-[#c89a45]/20" />
            <div className="h-px w-12 bg-[#8f6d35]" />
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#eddaba] sm:text-xl">
            Analise cosmetica capilar masculina para barbearias premium. Tecnologia estetica focada em protocolos personalizados de higienizacao cosmetica, barba e cronograma home care.
          </p>

          <a
            href="#workspace"
            onClick={() => setWorkspaceVisible(true)}
            className="mt-10 inline-flex items-center justify-center rounded-md border border-[#f0dcc0] bg-[#e8d0ab] px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#17110a] transition hover:bg-[#f0dcc0]"
          >
            Iniciar analise cosmetica profissional
          </a>

          <div className="mt-12 w-full border-t border-[#4f3a1b] pt-8">
            <div className="grid gap-6 text-left sm:grid-cols-3">
              {journeySteps.map((step, index) => (
                <article key={step.title} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f6ead5]">
                    {index + 1}. {step.title}
                  </p>
                  <p className="text-sm leading-relaxed text-[#b89d71]">{step.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-[#3d2d14] bg-[#120c07] px-5 py-4 text-left text-xs leading-relaxed text-[#9f7f4b]">
              Nota importante: Esta plataforma executa analises com propositos meramente cosmeticos, de embelezamento e estilizacao capilar masculina. Nao possui natureza clinica, nao emitindo qualquer parecer sobre patologias ou prescricoes medicas.
            </div>
          </div>
        </section>

        <section
          id="workspace"
          className={`grid gap-6 pb-10 transition-all duration-500 xl:grid-cols-[1.1fr_0.9fr] ${workspaceVisible ? 'opacity-100' : 'opacity-100'}`}
        >
          <div className="grid gap-6">
            <div className="rounded-[28px] border border-[#4c3617] bg-[#120b07]/95 p-5 shadow-[0_18px_80px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#b68b42]">Captura cosmetica</p>
                  <h2 className="mt-2 font-serif text-3xl text-[#f7ecdc]">Foto do cliente e triagem visual</h2>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#7d6231] bg-[#1b130c] px-4 py-2 text-sm text-[#efd6a9] transition hover:bg-[#261a10]">
                  <Upload className="h-4 w-4" />
                  Selecionar imagem
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[24px] border border-dashed border-[#5e4420] bg-[#0b0705] p-4">
                  {previewUrl ? (
                    <div className="overflow-hidden rounded-[20px] border border-[#4a371d] bg-black">
                      <img src={previewUrl} alt="Preview do cliente" className="h-[360px] w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-[360px] flex-col items-center justify-center rounded-[20px] bg-[radial-gradient(circle_at_top,_rgba(200,154,69,0.14),_transparent_35%),linear-gradient(180deg,_rgba(18,12,7,0.95),_rgba(10,7,5,1))] px-6 text-center">
                      <div className="rounded-full border border-[#7d6231] bg-[#19110b] p-4 text-[#d3aa63]">
                        <Camera className="h-7 w-7" />
                      </div>
                      <h3 className="mt-5 font-serif text-2xl text-[#f6ead5]">Pronto para escanear</h3>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#bea378]">
                        Carregue uma imagem frontal ou lateral para iniciar a leitura estetica e montar o protocolo da sessao.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-[24px] border border-[#4a371d] bg-[#0d0806] p-5">
                  <div className="flex items-center gap-3 text-[#f3dec0]">
                    <UserRound className="h-5 w-5 text-[#cf9e4d]" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#8f6e38]">Ficha do cliente</p>
                      <p className="mt-1 text-lg font-semibold text-[#f8efdf]">Mateus Silva</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 text-sm text-[#d4bf9b]">
                    <div className="rounded-2xl border border-[#332515] bg-[#140e09] p-4">
                      Queixa principal: afinamento frontal, brilho excessivo na raiz e busca por acabamento mais limpo.
                    </div>
                    <div className="rounded-2xl border border-[#332515] bg-[#140e09] p-4">
                      Objetivo: corte premium com orientacao home care e recomendacao de finalizacao.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalysis}
                    disabled={!selectedFile || isAnalyzing}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-[#d7b56f] bg-[#d9b977] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#1a130c] transition hover:bg-[#e4c588] disabled:cursor-not-allowed disabled:border-[#4b3b25] disabled:bg-[#2c2216] disabled:text-[#857052]"
                  >
                    {isAnalyzing ? 'Analisando imagem...' : 'Gerar diagnostico estetico'}
                  </button>

                  <div className="mt-4 rounded-2xl border border-[#332515] bg-[#140e09] p-4 text-sm text-[#c9b08a]">
                    {selectedFile
                      ? `Arquivo selecionado: ${selectedFile.name}`
                      : 'Nenhuma imagem selecionada. O diagnostico sera habilitado quando a foto for enviada.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-[28px] border border-[#4c3617] bg-[#120b07]/95 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#b68b42]">Leitura tecnica</p>
                    <h2 className="mt-2 font-serif text-3xl text-[#f7ecdc]">Resumo do scan</h2>
                  </div>
                  <span className="rounded-full border border-[#4c3617] bg-[#19110b] px-3 py-1 text-xs text-[#cdb07f]">
                    {analysisReady ? 'Atualizado agora' : 'Aguardando imagem'}
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  {metrics.map((metric) => (
                    <article key={metric.label} className="rounded-3xl border border-[#332515] bg-[#0d0806] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-[#9d8359]">{metric.label}</p>
                          <p className="mt-2 text-lg font-semibold text-[#f8efdf]">{metric.value}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs ${toneClasses(metric.tone)}`}>
                          {metric.score > 0 ? `${metric.score}%` : '--'}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-[#4c3617] bg-[#120b07]/95 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.28)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[#b68b42]">Relatorio estetico</p>
                <h2 className="mt-2 font-serif text-3xl text-[#f7ecdc]">Plano de acao profissional</h2>

                <div className="mt-6 rounded-[24px] border border-[#6e5124] bg-[radial-gradient(circle_at_top,_rgba(200,154,69,0.14),_transparent_40%),linear-gradient(180deg,_rgba(24,16,10,0.96),_rgba(12,8,6,1))] p-5">
                  <p className="text-sm text-[#c8b089]">Corte recomendado</p>
                  <p className="mt-2 font-serif text-2xl text-[#fff4e3]">Low fade com textura no topo</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#d2bb98]">
                    Preserva volume superior, reduz o brilho lateral e valoriza uma leitura visual mais densa na linha frontal.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {carePlan.map((item) => (
                    <div key={item} className="rounded-2xl border border-[#332515] bg-[#0d0806] p-4 text-sm leading-relaxed text-[#d4bf9b]">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="grid gap-6">
            <section className="rounded-[28px] border border-[#4c3617] bg-[#120b07]/95 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.28)]">
              <div className="flex items-center gap-3 text-[#ddb971]">
                <Clock3 className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.24em] text-[#b68b42]">Agenda premium</p>
              </div>
              <h2 className="mt-3 font-serif text-3xl text-[#f7ecdc]">Fila de atendimento</h2>

              <div className="mt-6 space-y-4">
                {upcomingClients.map((client) => (
                  <article key={`${client.name}-${client.time}`} className="rounded-3xl border border-[#332515] bg-[#0d0806] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-[#f8efdf]">{client.name}</p>
                        <p className="mt-1 text-sm text-[#a98c5d]">{client.service}</p>
                      </div>
                      <span className="rounded-full border border-[#6b4f24] bg-[#1a120b] px-3 py-1 text-xs text-[#d7b56f]">
                        {client.time}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-[#4c3617] bg-[#120b07]/95 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.28)]">
              <div className="flex items-center gap-3 text-[#ddb971]">
                <Sparkles className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.24em] text-[#b68b42]">Protocolo</p>
              </div>
              <h2 className="mt-3 font-serif text-3xl text-[#f7ecdc]">Como a tela opera</h2>

              <div className="mt-6 space-y-4">
                {journeySteps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-[#332515] bg-[#0d0806] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#cf9e4d]">Etapa {index + 1}</p>
                    <p className="mt-2 text-base font-semibold text-[#f7ecdc]">{step.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#c6ae88]">{step.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#332515] bg-[#0d0806] p-4 text-sm leading-relaxed text-[#b79766]">
                Ambiente pensado para recepcao, triagem e apresentacao visual do resultado sem sair do padrao premium do design original.
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}