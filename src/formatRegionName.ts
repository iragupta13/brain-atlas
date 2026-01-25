/**
 * Converts AAL3 atlas mesh names (e.g. "Frontal_Sup_2_L") into
 * human-readable display names (e.g. "Superior Frontal 2 (Left)").
 */

const HEMISPHERE_SUFFIXES: Record<string, string> = {
  _L: "Left",
  _R: "Right",
  _D: "Dorsal",
  _M: "Median",
};

/** Full-name overrides for compound acronyms / special cases. */
const SPECIAL_NAMES: Record<string, string> = {
  OFCmed: "Orbitofrontal Cortex Medial",
  OFCant: "Orbitofrontal Cortex Anterior",
  OFCpost: "Orbitofrontal Cortex Posterior",
  OFClat: "Orbitofrontal Cortex Lateral",
  VTA: "Ventral Tegmental Area",
  LC: "Locus Coeruleus",
  N_Acc: "Nucleus Accumbens",
  Red_N: "Red Nucleus",
  SN_pc: "Substantia Nigra Pars Compacta",
  SN_pr: "Substantia Nigra Pars Reticulata",
  ACC_sub: "Anterior Cingulate Subgenual",
  ACC_pre: "Anterior Cingulate Pregenual",
  ACC_sup: "Anterior Cingulate Supragenual",
  Supp_Motor_Area: "Supplementary Motor Area",
  Paracentral_Lobule: "Paracentral Lobule",
  Rolandic_Oper: "Rolandic Operculum",
  SupraMarginal: "Supramarginal Gyrus",
  ParaHippocampal: "Parahippocampal Gyrus",
};

/** Thalamic nuclei abbreviation expansions. */
const THAL_NUCLEI: Record<string, string> = {
  AV: "Anteroventral",
  LP: "Lateral Posterior",
  VA: "Ventral Anterior",
  VL: "Ventral Lateral",
  VPL: "Ventral Posterolateral",
  IL: "Intralaminar",
  Re: "Reuniens",
  MDm: "Mediodorsal Medial",
  MDl: "Mediodorsal Lateral",
  LGN: "Lateral Geniculate",
  MGN: "Medial Geniculate",
  PuI: "Pulvinar Inferior",
  PuM: "Pulvinar Medial",
  PuA: "Pulvinar Anterior",
  PuL: "Pulvinar Lateral",
};

/** Word-level abbreviation expansions. */
const WORD_EXPANSIONS: Record<string, string> = {
  Sup: "Superior",
  Inf: "Inferior",
  Mid: "Middle",
  Oper: "Opercular",
  Tri: "Triangular",
  Orb: "Orbital",
  Med: "Medial",
  Ant: "Anterior",
  Post: "Posterior",
  Supp: "Supplementary",
  Cingulate: "Cingulate",
  Pole: "Pole",
};

export function formatRegionName(meshName: string): string {
  // 1. Extract hemisphere suffix
  let hemisphere = "";
  let baseName = meshName;

  for (const [suffix, label] of Object.entries(HEMISPHERE_SUFFIXES)) {
    if (meshName.endsWith(suffix)) {
      hemisphere = label;
      baseName = meshName.slice(0, -suffix.length);
      break;
    }
  }

  // 2. Check special names
  if (SPECIAL_NAMES[baseName]) {
    return hemisphere
      ? `${SPECIAL_NAMES[baseName]} (${hemisphere})`
      : SPECIAL_NAMES[baseName];
  }

  // 3. Handle thalamic nuclei: "Thal_XX" → "Thalamus XX-expanded"
  const thalMatch = baseName.match(/^Thal_(.+)$/);
  if (thalMatch) {
    const nucleus = THAL_NUCLEI[thalMatch[1]] || thalMatch[1];
    const name = `Thalamus ${nucleus}`;
    return hemisphere ? `${name} (${hemisphere})` : name;
  }

  // 4. Handle cerebellum: "Cerebellum_Crus1" or "Cerebellum_4_5"
  const cerebMatch = baseName.match(/^Cerebellum_(.+)$/);
  if (cerebMatch) {
    const part = cerebMatch[1].replace(/_/g, " ");
    const name = `Cerebellum ${part}`;
    return hemisphere ? `${name} (${hemisphere})` : name;
  }

  // 5. Handle Vermis (no hemisphere): "Vermis_1_2" → "Vermis 1-2"
  const vermisMatch = baseName.match(/^Vermis_(.+)$/);
  if (vermisMatch) {
    const part = vermisMatch[1].replace(/_/g, "-");
    return `Vermis ${part}`;
  }

  // 6. General case: split on underscores, expand known abbreviations
  const words = baseName.split("_");
  const expanded = words.map((w) => WORD_EXPANSIONS[w] || w);
  const name = expanded.join(" ");

  return hemisphere ? `${name} (${hemisphere})` : name;
}
