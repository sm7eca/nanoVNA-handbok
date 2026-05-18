# NanoVNA för Amatörradio

**Praktisk handbok för mätning, felsökning och antennteknik**

*Arne Nilsson — SM6ECA*
Version 4 – omarbetad utgåva

---

## 📥 Ladda ner

| Fil | Beskrivning |
|-----|-------------|
| [`NanoVNA_Handbok_V4-2.pdf`](NanoVNA_Handbok_V4-2.pdf) | Handboken (PDF) |
| [`NanoVNA_Handbok_Presentation.pptx`](NanoVNA_Handbok_Presentation.pptx) | Presentationsbilder |

---

## Om handboken

NanoVNA har förändrat amatörradion på samma sätt som oscilloskopet och den digitala multimetern en gång gjorde. Tidigare krävdes dyr laboratorieutrustning för att mäta antenner, filter, koaxkablar och impedanser — i dag klarar ett litet instrument på skrivbordet avancerade RF-mätningar som tidigare bara var möjliga i professionella laboratorier.

Den här handboken ger en **praktisk och tydlig vägledning** med fokus på förståelse: vad som mäts, varför det mäts, och hur resultaten tolkas i verkliga situationer. Matematiska härledningar är nedtonade till förmån för metodik och tillämpning.

### Vad du lär dig

- Mäta SWR och impedans med rätt metodik
- Förstå och använda Smith-diagrammet som praktiskt verktyg
- Kalibrera korrekt och förstå varför det är avgörande
- Felsöka antennkablar med S21 och TDR
- Justera och optimera kortvågs- och VHF/UHF-antenner
- Mäta filter, baluner och RF-komponenter
- Identifiera och åtgärda common-mode-problem
- Arbeta metodiskt — ändra en sak i taget, mät, dokumentera

---

## Innehåll

### Del 1 – Grundläggande användning
| Kapitel | Innehåll |
|---------|----------|
| 1 | Vad är NanoVNA? — S11, S21, visningsformat, modeller |
| 2 | Arbetsmetodik — 7 regler för tillförlitliga mätningar |
| 3 | Komma igång — portar, frekvensinställning, traces, markers |
| 4 | Kalibrering — OSL, referensplan, enports- och tvåportskalibrering |
| 5 | Grundläggande mätmetoder — SWR, Smith, kabeldämpning, TDR, filter |

### Del 2 – Antennmätningar
| Kapitel | Innehåll |
|---------|----------|
| 6 | SWR, impedans och antennanalys |
| 7 | Trimma olika antenntyper |
| 8 | Antennsystem och station — tuner, balun, matningspunkt |

### Del 3 – Koax och transmissionslinjer
| Kapitel | Innehåll |
|---------|----------|
| 9 | Koaxkablar: mätning och felsökning — S21, TDR, velocity factor |
| 10 | Common-mode och RF-problem — diagnos och choke-lösningar |

### Del 4 – Filter och RF-komponenter
| Kapitel | Innehåll |
|---------|----------|
| 11 | Filter, baluner, dämpare och förstärkare |

### Del 5 – Avancerade tekniker
| Kapitel | Innehåll |
|---------|----------|
| 12 | Avancerad antennanalys — Q, bandbredd, Smith som designverktyg |
| 13 | NanoVNA som stationsverktyg — rutinmätningar och dokumentation |

### Del 6 – Fördjupning
| Kapitel | Innehåll |
|---------|----------|
| 14 | Avancerade HF- och mikrovågsexperiment |

### Bilagor
| Bilaga | Innehåll |
|--------|----------|
| A | Snabbreferens vid mätbordet — checklista och kommandon |
| B | Vanliga problem och felsökning — strukturerad tabell |
| C | Praktiska byggprojekt — RF-pickup-loop, dummyload, choker, kit |
| D | Praktiska övningar — laborationsskrivna uppgifter, även för radioklubb |
| E | Ordförklaringar och RF-begrepp |
| F | Praktiska exempel från stationen — 8 verkliga fall |

---

## Säkerhet

> ⚠️ **NanoVNA är ett lågsignalinstrument och förstörs av sändareffekt.**
>
> Koppla alltid bort radion och kontrollera att ingen RF finns på kabeln innan NanoVNA ansluts. Avlägsna bias-T och DC-matning. Instrumentet tål inte sändareffekt under några omständigheter.

---

## Kompatibilitet

Handboken är tillämplig på alla vanliga NanoVNA-varianter. Grundprincipen och menystrukturen är likartad mellan modellerna.

| Modell | Kommentar |
|--------|-----------|
| **NanoVNA-H4** | Populärast bland amatörer — bra balans pris/prestanda, färgdisplay, batteridrift |
| **NanoVNA V2** | Bättre dynamikområde, stöd för högre frekvenser |
| Övriga varianter | Täcks av handbokens grundprinciper |

---

## Licens

Fri att använda, dela och anpassa med källhänvisning.
© Arne Nilsson SM6ECA — Version 4

---

*73 de SM6ECA*
