export interface BrainFunction {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  primaryRegions: string[];
  secondaryRegions: string[];
  explanation: string;
}

export const brainFunctions: BrainFunction[] = [
  {
    id: 'motor-control',
    name: 'Motor Control',
    description: 'Voluntary movement planning and execution, including fine motor skills and coordination.',
    keywords: ['movement', 'motor', 'muscle', 'walking', 'running', 'motion', 'voluntary', 'coordination', 'action', 'move', 'moving'],
    primaryRegions: ['Precentral_L', 'Precentral_R', 'Supp_Motor_Area_L', 'Supp_Motor_Area_R'],
    secondaryRegions: ['Paracentral_Lobule_L', 'Paracentral_Lobule_R', 'Putamen_L', 'Putamen_R', 'Cerebellum_4_5_L', 'Cerebellum_4_5_R'],
    explanation: 'The precentral gyrus (primary motor cortex) initiates voluntary movements, while the supplementary motor area plans complex sequences. The basal ganglia and cerebellum fine-tune movement execution.'
  },
  {
    id: 'vision',
    name: 'Visual Processing',
    description: 'Processing of visual information from the eyes, including object recognition and spatial awareness.',
    keywords: ['vision', 'visual', 'sight', 'see', 'seeing', 'eyes', 'look', 'looking', 'image', 'perception', 'watch'],
    primaryRegions: ['Calcarine_L', 'Calcarine_R', 'Cuneus_L', 'Cuneus_R'],
    secondaryRegions: ['Occipital_Sup_L', 'Occipital_Sup_R', 'Occipital_Mid_L', 'Occipital_Mid_R', 'Occipital_Inf_L', 'Occipital_Inf_R', 'Lingual_L', 'Lingual_R', 'Thal_LGN_L', 'Thal_LGN_R'],
    explanation: 'Visual information travels from the eyes through the lateral geniculate nucleus (LGN) to the calcarine sulcus (primary visual cortex). Higher processing occurs in surrounding occipital areas for motion, color, and object recognition.'
  },
  {
    id: 'hearing',
    name: 'Auditory Processing',
    description: 'Processing of sound, including speech perception, music, and environmental sounds.',
    keywords: ['hearing', 'auditory', 'sound', 'listen', 'listening', 'audio', 'ear', 'ears', 'music', 'speech', 'noise'],
    primaryRegions: ['Heschl_L', 'Heschl_R', 'Temporal_Sup_L', 'Temporal_Sup_R'],
    secondaryRegions: ['Thal_MGN_L', 'Thal_MGN_R', 'Temporal_Mid_L', 'Temporal_Mid_R'],
    explanation: 'Sound is processed in Heschl\'s gyrus (primary auditory cortex) after relaying through the medial geniculate nucleus (MGN). The superior temporal gyrus handles complex sound processing including speech.'
  },
  {
    id: 'memory-formation',
    name: 'Memory Formation',
    description: 'Encoding and consolidation of new memories, particularly episodic and spatial memories.',
    keywords: ['memory', 'remember', 'remembering', 'memorize', 'recall', 'learning', 'learn', 'forget', 'hippocampus', 'episodic'],
    primaryRegions: ['Hippocampus_L', 'Hippocampus_R'],
    secondaryRegions: ['ParaHippocampal_L', 'ParaHippocampal_R', 'Temporal_Mid_L', 'Temporal_Mid_R', 'Thal_AV_L', 'Thal_AV_R'],
    explanation: 'The hippocampus is essential for forming new declarative memories. The parahippocampal gyrus processes spatial context, while connections to the thalamus help consolidate memories during sleep.'
  },
  {
    id: 'emotion',
    name: 'Emotion Processing',
    description: 'Processing and regulation of emotions, including fear, pleasure, and social emotions.',
    keywords: ['emotion', 'emotional', 'feeling', 'feelings', 'fear', 'anxiety', 'happy', 'sad', 'mood', 'affect', 'stress'],
    primaryRegions: ['Amygdala_L', 'Amygdala_R', 'Insula_L', 'Insula_R'],
    secondaryRegions: ['ACC_sub_L', 'ACC_sub_R', 'ACC_pre_L', 'ACC_pre_R', 'OFCmed_L', 'OFCmed_R'],
    explanation: 'The amygdala processes emotional significance, especially fear and threat detection. The insula integrates bodily sensations with emotions, while the anterior cingulate cortex regulates emotional responses.'
  },
  {
    id: 'language-production',
    name: 'Language Production (Broca\'s Area)',
    description: 'Speech production, grammar processing, and articulation of language.',
    keywords: ['broca', 'speech', 'speaking', 'talk', 'talking', 'articulation', 'grammar', 'produce', 'say', 'verbal'],
    primaryRegions: ['Frontal_Inf_Oper_L', 'Frontal_Inf_Tri_L'],
    secondaryRegions: ['Frontal_Inf_Oper_R', 'Frontal_Inf_Tri_R', 'Rolandic_Oper_L', 'Rolandic_Oper_R', 'Supp_Motor_Area_L'],
    explanation: 'Broca\'s area in the left inferior frontal gyrus is critical for speech production and grammatical processing. It coordinates with motor areas to produce fluent speech.'
  },
  {
    id: 'language-comprehension',
    name: 'Language Comprehension (Wernicke\'s Area)',
    description: 'Understanding spoken and written language, semantic processing.',
    keywords: ['wernicke', 'comprehension', 'understand', 'understanding', 'language', 'semantic', 'meaning', 'read', 'reading', 'words'],
    primaryRegions: ['Temporal_Sup_L', 'Temporal_Sup_R', 'Angular_L', 'Angular_R'],
    secondaryRegions: ['Temporal_Mid_L', 'Temporal_Mid_R', 'SupraMarginal_L', 'SupraMarginal_R'],
    explanation: 'Wernicke\'s area in the posterior superior temporal gyrus processes language comprehension. The angular gyrus integrates multiple sensory inputs for reading and semantic understanding.'
  },
  {
    id: 'decision-making',
    name: 'Decision Making',
    description: 'Executive functions including planning, judgment, and decision-making processes.',
    keywords: ['decision', 'decide', 'deciding', 'executive', 'planning', 'plan', 'judgment', 'choice', 'choose', 'choosing', 'prefrontal', 'think', 'thinking'],
    primaryRegions: ['Frontal_Sup_2_L', 'Frontal_Sup_2_R', 'Frontal_Mid_2_L', 'Frontal_Mid_2_R'],
    secondaryRegions: ['Frontal_Sup_Medial_L', 'Frontal_Sup_Medial_R', 'ACC_sup_L', 'ACC_sup_R', 'OFClat_L', 'OFClat_R'],
    explanation: 'The prefrontal cortex integrates information for complex decision-making. The dorsolateral prefrontal cortex handles working memory, while the orbitofrontal cortex evaluates reward and risk.'
  },
  {
    id: 'balance',
    name: 'Balance & Coordination',
    description: 'Maintaining posture, balance, and coordinating smooth movements.',
    keywords: ['balance', 'coordination', 'equilibrium', 'posture', 'vestibular', 'steady', 'stability', 'gait', 'walking'],
    primaryRegions: ['Vermis_1_2', 'Vermis_3', 'Vermis_4_5', 'Vermis_6'],
    secondaryRegions: ['Cerebellum_3_L', 'Cerebellum_3_R', 'Cerebellum_4_5_L', 'Cerebellum_4_5_R', 'Cerebellum_6_L', 'Cerebellum_6_R'],
    explanation: 'The cerebellar vermis is the primary balance center, integrating vestibular information. The surrounding cerebellar hemispheres coordinate limb movements and maintain posture.'
  },
  {
    id: 'sensory',
    name: 'Somatosensory Processing',
    description: 'Processing touch, temperature, pain, and proprioception from the body.',
    keywords: ['touch', 'sensory', 'sensation', 'feel', 'feeling', 'pain', 'temperature', 'pressure', 'skin', 'proprioception', 'tactile'],
    primaryRegions: ['Postcentral_L', 'Postcentral_R'],
    secondaryRegions: ['Parietal_Sup_L', 'Parietal_Sup_R', 'Parietal_Inf_L', 'Parietal_Inf_R', 'Thal_VPL_L', 'Thal_VPL_R'],
    explanation: 'The postcentral gyrus (primary somatosensory cortex) receives tactile information relayed through the thalamus. The parietal association areas integrate this with spatial awareness.'
  },
  {
    id: 'reward',
    name: 'Reward & Motivation',
    description: 'Processing reward, pleasure, and motivational drives.',
    keywords: ['reward', 'pleasure', 'motivation', 'dopamine', 'addiction', 'craving', 'desire', 'wanting', 'satisfaction', 'enjoyment'],
    primaryRegions: ['N_Acc_L', 'N_Acc_R', 'VTA_L', 'VTA_R'],
    secondaryRegions: ['OFCmed_L', 'OFCmed_R', 'ACC_pre_L', 'ACC_pre_R', 'Caudate_L', 'Caudate_R'],
    explanation: 'The nucleus accumbens and ventral tegmental area (VTA) form the core reward circuit. Dopamine release signals reward prediction, driving motivation and reinforcement learning.'
  },
  {
    id: 'attention',
    name: 'Attention',
    description: 'Focusing and maintaining attention on specific stimuli or tasks.',
    keywords: ['attention', 'focus', 'concentrate', 'concentration', 'alert', 'vigilance', 'awareness', 'attentive'],
    primaryRegions: ['Parietal_Sup_L', 'Parietal_Sup_R', 'Frontal_Mid_2_L', 'Frontal_Mid_2_R'],
    secondaryRegions: ['ACC_sup_L', 'ACC_sup_R', 'Frontal_Sup_2_L', 'Frontal_Sup_2_R', 'Thal_PuA_L', 'Thal_PuA_R'],
    explanation: 'The dorsal attention network (parietal and frontal regions) controls voluntary attention. The pulvinar nucleus of the thalamus filters and gates attentional signals.'
  },
  {
    id: 'spatial-awareness',
    name: 'Spatial Awareness',
    description: 'Understanding spatial relationships and navigating the environment.',
    keywords: ['spatial', 'space', 'navigation', 'navigate', 'location', 'direction', 'where', 'position', 'map', 'orient', 'orientation'],
    primaryRegions: ['Parietal_Sup_L', 'Parietal_Sup_R', 'Precuneus_L', 'Precuneus_R'],
    secondaryRegions: ['Parietal_Inf_L', 'Parietal_Inf_R', 'ParaHippocampal_L', 'ParaHippocampal_R', 'Hippocampus_L', 'Hippocampus_R'],
    explanation: 'The posterior parietal cortex processes spatial relationships, while the precuneus integrates visuospatial information. The hippocampus provides cognitive maps for navigation.'
  },
  {
    id: 'face-recognition',
    name: 'Face Recognition',
    description: 'Identifying and processing faces and facial expressions.',
    keywords: ['face', 'faces', 'facial', 'recognition', 'recognize', 'identity', 'expression', 'expressions'],
    primaryRegions: ['Fusiform_L', 'Fusiform_R'],
    secondaryRegions: ['Temporal_Inf_L', 'Temporal_Inf_R', 'Amygdala_L', 'Amygdala_R', 'Occipital_Inf_L', 'Occipital_Inf_R'],
    explanation: 'The fusiform face area specializes in face identification. The amygdala processes facial expressions for emotional significance, while inferior temporal regions handle face-object categorization.'
  },
  {
    id: 'smell',
    name: 'Olfaction (Smell)',
    description: 'Processing smells and odors, with strong links to memory and emotion.',
    keywords: ['smell', 'olfactory', 'odor', 'scent', 'nose', 'aroma', 'fragrance', 'sniff'],
    primaryRegions: ['Olfactory_L', 'Olfactory_R'],
    secondaryRegions: ['Amygdala_L', 'Amygdala_R', 'ParaHippocampal_L', 'ParaHippocampal_R', 'OFCpost_L', 'OFCpost_R'],
    explanation: 'The olfactory cortex directly receives smell signals, uniquely bypassing the thalamus. Strong connections to the amygdala and hippocampus explain why smells powerfully evoke memories and emotions.'
  },
  {
    id: 'self-awareness',
    name: 'Self-Awareness',
    description: 'Consciousness of self, introspection, and self-referential thought.',
    keywords: ['self', 'awareness', 'conscious', 'consciousness', 'introspection', 'reflection', 'identity', 'self-reflection', 'metacognition'],
    primaryRegions: ['Frontal_Sup_Medial_L', 'Frontal_Sup_Medial_R', 'Precuneus_L', 'Precuneus_R'],
    secondaryRegions: ['Cingulate_Post_L', 'Cingulate_Post_R', 'Angular_L', 'Angular_R', 'Insula_L', 'Insula_R'],
    explanation: 'The medial prefrontal cortex and precuneus are key nodes in the default mode network, active during self-reflection. The posterior cingulate connects autobiographical memory with self-concept.'
  },
  {
    id: 'sleep-arousal',
    name: 'Sleep & Arousal',
    description: 'Regulating sleep-wake cycles and maintaining alertness.',
    keywords: ['sleep', 'wake', 'awake', 'arousal', 'drowsy', 'tired', 'alert', 'circadian', 'insomnia', 'rest'],
    primaryRegions: ['Thal_IL_L', 'Thal_IL_R', 'LC_L', 'LC_R'],
    secondaryRegions: ['Raphe_D', 'Raphe_M', 'Thal_Re_L', 'Thal_Re_R'],
    explanation: 'The intralaminar thalamus regulates cortical arousal. The locus coeruleus (norepinephrine) and raphe nuclei (serotonin) modulate sleep-wake transitions and maintain vigilance.'
  },
  {
    id: 'movement-disorders',
    name: 'Movement Regulation (Basal Ganglia)',
    description: 'Fine-tuning movement initiation and suppression, affected in Parkinson\'s and other movement disorders.',
    keywords: ['parkinson', 'tremor', 'dyskinesia', 'basal', 'ganglia', 'rigidity', 'bradykinesia', 'movement disorder'],
    primaryRegions: ['Putamen_L', 'Putamen_R', 'Caudate_L', 'Caudate_R', 'Pallidum_L', 'Pallidum_R'],
    secondaryRegions: ['SN_pc_L', 'SN_pc_R', 'SN_pr_L', 'SN_pr_R', 'Thal_VA_L', 'Thal_VA_R', 'Thal_VL_L', 'Thal_VL_R'],
    explanation: 'The basal ganglia circuit (striatum, pallidum, substantia nigra) selects and initiates appropriate movements while suppressing unwanted ones. Dopamine loss in the substantia nigra causes Parkinson\'s symptoms.'
  },
  {
    id: 'social-cognition',
    name: 'Social Cognition',
    description: 'Understanding others\' mental states, empathy, and social behavior.',
    keywords: ['social', 'empathy', 'theory of mind', 'mentalizing', 'empathize', 'others', 'perspective', 'compassion'],
    primaryRegions: ['Temporal_Pole_Sup_L', 'Temporal_Pole_Sup_R', 'Frontal_Sup_Medial_L', 'Frontal_Sup_Medial_R'],
    secondaryRegions: ['Temporal_Pole_Mid_L', 'Temporal_Pole_Mid_R', 'Angular_L', 'Angular_R', 'ACC_pre_L', 'ACC_pre_R'],
    explanation: 'The temporal poles and medial prefrontal cortex support theory of mind—understanding others\' intentions. The angular gyrus integrates social context, while the ACC monitors social conflicts.'
  },
  {
    id: 'working-memory',
    name: 'Working Memory',
    description: 'Temporarily holding and manipulating information for cognitive tasks.',
    keywords: ['working memory', 'short-term', 'temporary', 'hold', 'holding', 'manipulate', 'mental', 'buffer'],
    primaryRegions: ['Frontal_Mid_2_L', 'Frontal_Mid_2_R', 'Parietal_Inf_L', 'Parietal_Inf_R'],
    secondaryRegions: ['Frontal_Sup_2_L', 'Frontal_Sup_2_R', 'Parietal_Sup_L', 'Parietal_Sup_R', 'Thal_MDl_L', 'Thal_MDl_R'],
    explanation: 'The dorsolateral prefrontal cortex maintains information in working memory, while parietal regions support manipulation. The mediodorsal thalamus gates relevant information into prefrontal circuits.'
  },
];

export function getBrainFunctionById(id: string): BrainFunction | undefined {
  return brainFunctions.find(fn => fn.id === id);
}
